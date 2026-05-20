const fs = require('fs');
const https = require('https');

const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const Groq = require('groq-sdk');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const {
  buildMatchRequestBody,
  pickAnonymizedMatchCandidates,
  SERVER_CONFIG,
  readServerEnv,
  readServerSecurityEnv,
  readServerTlsEnv,
  validateMatchProxyStartup,
  validateMatchRequestPayload,
} = require('./server-config.cjs');
const { SERVER_REGEX } = require('./server-regex.cjs');

dotenv.config({ path: SERVER_CONFIG.ENV_FILE });

function parseJsonObject(value, fallback) {
  const fallbackObject =
    fallback !== undefined && fallback !== null
      ? fallback
      : JSON.parse(SERVER_CONFIG.GROQ.EMPTY_JSON_OBJECT_LITERAL);

  if (!value || typeof value !== 'string') {
    return fallbackObject;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallbackObject;
  }
}

function normalizeCandidates(candidates) {
  const K = SERVER_CONFIG.CANDIDATE_SORT_KEYS;
  return [...candidates]
    .map((candidate) => ({
      ...candidate,
      [K.SKILLS]: Array.isArray(candidate?.[K.SKILLS])
        ? [...candidate[K.SKILLS]].map((skill) => String(skill)).sort()
        : [],
    }))
    .sort((a, b) => {
      const byId = String(a?.[K.ID] ?? '').localeCompare(
        String(b?.[K.ID] ?? '')
      );
      if (byId !== 0) {
        return byId;
      }
      return String(a?.[K.NAME] ?? '').localeCompare(String(b?.[K.NAME] ?? ''));
    });
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    return `{${entries
      .map(
        ([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`
      )
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function createRequestCacheKey(payload) {
  return stableStringify(payload);
}

function normalizeText(text) {
  const space =
    SERVER_CONFIG.DETERMINISTIC.TEXT_NORMALIZATION
      .WHITESPACE_REPLACEMENT_IN_NORMALIZE_TEXT;
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(SERVER_REGEX.UNICODE_COMBINING_MARKS, '')
    .replace(SERVER_REGEX.NON_ALPHANUMERIC_TO_SPACE, space)
    .replace(SERVER_REGEX.WHITESPACE_RUN, space)
    .trim();
}

function tokenize(text) {
  const delim = SERVER_CONFIG.DETERMINISTIC.TEXT_NORMALIZATION.SPLIT_DELIMITER;
  const minLen =
    SERVER_CONFIG.DETERMINISTIC.TEXT_NORMALIZATION.TOKEN_MIN_LENGTH;
  return normalizeText(text)
    .split(delim)
    .map((token) => token.trim())
    .filter((token) => token.length >= minLen);
}

function extractMinYearsExperience(jobDescription) {
  const match = String(jobDescription).match(SERVER_REGEX.MIN_YEARS_EXPERIENCE);
  if (!match) {
    return SERVER_CONFIG.DETERMINISTIC.EXPERIENCE_PARSING.MIN_YEARS_FALLBACK;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed)
    ? parsed
    : SERVER_CONFIG.DETERMINISTIC.EXPERIENCE_PARSING.MIN_YEARS_FALLBACK;
}

function buildDeterministicJobRequirements(jobDescription, candidates) {
  const K = SERVER_CONFIG.CANDIDATE_SORT_KEYS;
  const jdTokens = new Set(tokenize(jobDescription));
  const skillPool = new Set(
    candidates.flatMap((candidate) =>
      Array.isArray(candidate[K.SKILLS])
        ? candidate[K.SKILLS].map((skill) => normalizeText(skill))
        : []
    )
  );
  const delim = SERVER_CONFIG.DETERMINISTIC.TEXT_NORMALIZATION.SPLIT_DELIMITER;
  const requiredSkills = [...skillPool]
    .filter((skill) => {
      if (!skill) {
        return false;
      }
      const parts = skill.split(delim).filter(Boolean);
      return parts.every((part) => jdTokens.has(part));
    })
    .sort();

  return {
    requiredSkills,
    minYearsExperience: extractMinYearsExperience(jobDescription),
  };
}

function computeDeterministicScore(jobRequirements, candidate) {
  const deterministicConfig = SERVER_CONFIG.DETERMINISTIC;
  const recommendationConfig = deterministicConfig.RECOMMENDATION;
  const yoeFallback =
    deterministicConfig.EXPERIENCE_PARSING
      .CANDIDATE_YOE_MISSING_NUMERIC_FALLBACK;
  const K = SERVER_CONFIG.CANDIDATE_SORT_KEYS;
  const normalizedSkills = Array.isArray(candidate[K.SKILLS])
    ? candidate[K.SKILLS].map((skill) => normalizeText(skill)).filter(Boolean)
    : [];
  const skillSet = new Set(normalizedSkills);
  const requiredSkills = jobRequirements.requiredSkills;
  const matchingSkills = requiredSkills.filter((skill) => skillSet.has(skill));
  const missingSkills = requiredSkills.filter((skill) => !skillSet.has(skill));

  const skillMatchScore =
    requiredSkills.length > 0
      ? (matchingSkills.length / requiredSkills.length) *
        deterministicConfig.WEIGHTS.SKILL_MATCH
      : deterministicConfig.WEIGHTS.SKILL_MATCH;

  const years = Number(candidate.yearsOfExperience ?? yoeFallback);
  const experienceRatioCap =
    SERVER_CONFIG.DETERMINISTIC.EXPERIENCE_RATIO_COMPARISON_CEILING;

  const experienceScore =
    jobRequirements.minYearsExperience > 0
      ? Math.min(
          years / jobRequirements.minYearsExperience,
          experienceRatioCap
        ) * deterministicConfig.WEIGHTS.EXPERIENCE
      : deterministicConfig.WEIGHTS.EXPERIENCE;

  const jdText = normalizeText(
    jobRequirements.requiredSkills.join(
      SERVER_CONFIG.DETERMINISTIC.TEXT_NORMALIZATION.SPLIT_DELIMITER
    )
  );
  const title = normalizeText(candidate.currentJobTitle);
  const titleAlignmentScore =
    title && jdText
      ? jdText.includes(title) || title.includes(jdText)
        ? deterministicConfig.TITLE_ALIGNMENT_SCORES.EXACT
        : tokenize(title).some((part) => jdText.includes(part))
          ? deterministicConfig.TITLE_ALIGNMENT_SCORES.PARTIAL
          : deterministicConfig.TITLE_ALIGNMENT_SCORES.LOW
      : deterministicConfig.TITLE_ALIGNMENT_SCORES.DEFAULT;

  const logisticsScore = deterministicConfig.WEIGHTS.LOGISTICS;
  const overall = Math.round(
    Math.max(
      deterministicConfig.SCORE_RANGE.MIN,
      Math.min(
        deterministicConfig.SCORE_RANGE.MAX,
        skillMatchScore + experienceScore + titleAlignmentScore + logisticsScore
      )
    )
  );

  const primaryStrengths = [];
  if (matchingSkills.length > 0) {
    const joiner = recommendationConfig.INLINE_SKILLS_JOINER;
    primaryStrengths.push(
      `${recommendationConfig.MATCHED_SKILLS_PREFIX}${matchingSkills
        .slice(0, recommendationConfig.MAX_SKILLS_LIST)
        .join(joiner)}${recommendationConfig.PERIOD}`
    );
  }
  if (years > yoeFallback) {
    const experienceContext =
      jobRequirements.minYearsExperience > 0
        ? recommendationConfig.EXPERIENCE_WITH_REQUIREMENT(
            years,
            jobRequirements.minYearsExperience
          )
        : recommendationConfig.EXPERIENCE_SIMPLE(years);
    primaryStrengths.push(experienceContext);
  }
  if (candidate.currentJobTitle) {
    primaryStrengths.push(
      `${recommendationConfig.ROLE_ALIGNMENT_PREFIX}${candidate.currentJobTitle}${recommendationConfig.PERIOD}`
    );
  }

  const gaps =
    missingSkills.length > 0
      ? `${recommendationConfig.GAPS_PREFIX}${missingSkills
          .slice(0, recommendationConfig.MAX_SKILLS_LIST)
          .join(recommendationConfig.INLINE_SKILLS_JOINER)}${
          recommendationConfig.PERIOD
        }`
      : recommendationConfig.GAPS_NONE;

  const verdict =
    overall >= recommendationConfig.STRONG_THRESHOLD
      ? recommendationConfig.STRONG_VERDICT
      : overall >= recommendationConfig.MODERATE_THRESHOLD
        ? recommendationConfig.MODERATE_VERDICT
        : recommendationConfig.LIMITED_VERDICT;

  const recommendation = [...primaryStrengths, gaps, verdict].join(
    recommendationConfig.RECOMMENDATION_BLOCK_JOINER
  );

  return {
    id: String(candidate[K.ID] ?? ''),
    matchScore: overall,
    matchingSkills,
    missingSkills,
    candidateProfile: {
      skills: Array.isArray(candidate[K.SKILLS]) ? candidate[K.SKILLS] : [],
      yearsExperience: Number.isFinite(years) ? years : yoeFallback,
      topJobTitles: candidate.currentJobTitle
        ? [candidate.currentJobTitle]
        : [],
      education: deterministicConfig.OUTPUT_DEFAULTS.EMPTY_EDUCATION_STRING,
    },
    recommendation,
  };
}

function scoreCandidatesDeterministically(jobDescription, candidates) {
  const jobRequirements = buildDeterministicJobRequirements(
    jobDescription,
    candidates
  );
  return {
    scores: candidates.map((candidate) =>
      computeDeterministicScore(jobRequirements, candidate)
    ),
  };
}

function isMalformedJsonBodyError(err) {
  if (!err || typeof err !== 'object') {
    return false;
  }
  if (
    SERVER_CONFIG.HTTP.BODY_PARSE_JSON_ERROR_TYPES.includes(err.type) &&
    typeof err.body === 'string'
  ) {
    return true;
  }
  return (
    err instanceof SyntaxError &&
    typeof err.body !== 'undefined' &&
    typeof err.message === 'string' &&
    SERVER_CONFIG.HTTP.JSON_SYNTAX_HINT_PATTERN.test(err.message)
  );
}

function createApp({
  groqClient,
  security,
  suppressErrorDetail: suppressErrorDetailOption,
} = {}) {
  const resolvedSecurity = security ?? readServerSecurityEnv();
  const suppressMatchErrors =
    suppressErrorDetailOption !== undefined
      ? suppressErrorDetailOption
      : process.env.NODE_ENV === SERVER_CONFIG.NODE_ENV_VALUES.PRODUCTION;

  const app = express();
  const h = SERVER_CONFIG.HTTP;
  const hm = SERVER_CONFIG.HTTP.HELMET;

  if (resolvedSecurity.trustProxy) {
    app.set('trust proxy', h.TRUST_PROXY_HOPS);
  }

  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: hm.CONTENT_SECURITY_POLICY,
      crossOriginEmbedderPolicy: hm.CROSS_ORIGIN_EMBEDDER_POLICY,
      referrerPolicy: { policy: hm.REFERRER_POLICY },
      frameguard: { action: hm.FRAMEGUARD_ACTION },
      permissionsPolicy: hm.PERMISSIONS_POLICY,
      ...(resolvedSecurity.enableHsts
        ? {
            hsts: {
              maxAge: hm.HSTS_MAX_AGE_SECONDS,
              includeSubDomains: hm.HSTS_INCLUDE_SUBDOMAINS,
              preload: Boolean(resolvedSecurity.hstsPreload),
            },
          }
        : { hsts: false }),
    })
  );

  const corsCfg = SERVER_CONFIG.CORS;

  app.use(
    cors({
      origin: resolvedSecurity.corsOriginOption,
      methods: corsCfg.METHODS,
      allowedHeaders: corsCfg.ALLOWED_HEADERS,
      credentials: corsCfg.CREDENTIALS,
      maxAge: corsCfg.MAX_AGE_SECONDS,
      optionsSuccessStatus: corsCfg.OPTIONS_SUCCESS_STATUS,
    })
  );

  app.use(express.json({ limit: SERVER_CONFIG.JSON_LIMIT }));

  const matchLimiter = rateLimit({
    windowMs: SERVER_CONFIG.MATCH_RATE_LIMIT.WINDOW_MS,
    max: resolvedSecurity.matchRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: SERVER_CONFIG.MATCH_RATE_LIMIT.MESSAGE },
    skip: (req) => req.method === SERVER_CONFIG.HTTP.RATE_LIMIT_SKIP_METHOD,
  });

  const responseCache = new Map();
  app.get(SERVER_CONFIG.ROUTES.HEALTH, (_req, res) => {
    res
      .status(SERVER_CONFIG.STATUS.OK)
      .json(SERVER_CONFIG.HEALTH.RESPONSE_BODY);
  });

  async function handleMatch(req, res) {
    const validated = validateMatchRequestPayload(req.body);
    if (!validated.ok) {
      res.status(SERVER_CONFIG.STATUS.BAD_REQUEST).json({
        error: validated.error,
      });
      return;
    }

    const {
      jobDescription,
      candidates,
      model,
      temperature,
      topP,
      seed,
      deterministic,
    } = validated;

    const normalizedCandidates = normalizeCandidates(
      pickAnonymizedMatchCandidates(candidates)
    );
    const cacheKey = createRequestCacheKey({
      jobDescription: jobDescription.trim(),
      candidates: normalizedCandidates,
      model: model || SERVER_CONFIG.GROQ.DEFAULT_MODEL,
      temperature: temperature ?? SERVER_CONFIG.GROQ.DEFAULT_TEMPERATURE,
      topP: topP ?? SERVER_CONFIG.GROQ.DEFAULT_TOP_P,
      seed: seed ?? SERVER_CONFIG.GROQ.DEFAULT_SEED,
      deterministic: deterministic === true,
    });
    const cached = responseCache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    if (deterministic === true) {
      const deterministicResult = scoreCandidatesDeterministically(
        jobDescription,
        normalizedCandidates
      );
      responseCache.set(cacheKey, deterministicResult);
      res.json(deterministicResult);
      return;
    }

    try {
      const completion = await groqClient.chat.completions.create(
        buildMatchRequestBody({
          jobDescription,
          candidates: normalizedCandidates,
          model,
          temperature,
          topP,
          seed,
        })
      );
      const raw =
        completion?.choices?.[0]?.message?.content ||
        SERVER_CONFIG.GROQ.EMPTY_JSON_OBJECT_LITERAL;
      const parsed = parseJsonObject(raw);
      responseCache.set(cacheKey, parsed);
      res.json(parsed);
    } catch (error) {
      const internal =
        error instanceof Error
          ? error.message
          : SERVER_CONFIG.MESSAGES.GROQ_FAILED;
      const L = SERVER_CONFIG.LOG;
      console.error(`${L.MATCH_PROXY_PREFIX} ${L.GROQ_ERROR}`, internal);
      res.status(SERVER_CONFIG.STATUS.INTERNAL_SERVER_ERROR).json({
        error: suppressMatchErrors
          ? SERVER_CONFIG.MESSAGES.GROQ_FAILED_CLIENT
          : internal,
      });
    }
  }

  app.post(SERVER_CONFIG.ROUTES.MATCH, matchLimiter, handleMatch);
  app.post(SERVER_CONFIG.ROUTES.MATCH_LEGACY, matchLimiter, handleMatch);

  app.use((_req, res) => {
    res
      .status(SERVER_CONFIG.STATUS.NOT_FOUND)
      .json({ error: SERVER_CONFIG.MESSAGES.NOT_FOUND });
  });

  // eslint-disable-next-line no-unused-vars -- Express error middleware signature
  app.use((err, _req, res, _next) => {
    if (isMalformedJsonBodyError(err)) {
      res.status(SERVER_CONFIG.STATUS.BAD_REQUEST).json({
        error: SERVER_CONFIG.MESSAGES.INVALID_JSON_BODY,
      });
      return;
    }

    const L = SERVER_CONFIG.LOG;
    console.error(`${L.SERVER_PREFIX} ${L.UNHANDLED_ERROR}`, err);
    const internal =
      err instanceof Error ? err.message : SERVER_CONFIG.MESSAGES.GROQ_FAILED;
    res.status(SERVER_CONFIG.STATUS.INTERNAL_SERVER_ERROR).json({
      error: suppressMatchErrors
        ? SERVER_CONFIG.MESSAGES.INTERNAL_ERROR_CLIENT
        : internal,
    });
  });

  return app;
}

function startServer() {
  const { port, apiKey } = readServerEnv();
  if (!apiKey) {
    console.error(SERVER_CONFIG.MESSAGES.MISSING_API_KEY);
    process.exit(1);
  }

  const tlsConfig = readServerTlsEnv(process.env);
  if (tlsConfig && tlsConfig.ok === false) {
    console.error(tlsConfig.error);
    process.exit(1);
  }

  const tlsActive = Boolean(tlsConfig && tlsConfig.ok);
  const security = readServerSecurityEnv(process.env, { tlsActive });
  const startup = validateMatchProxyStartup(process.env, security);
  if (!startup.ok) {
    console.error(startup.error);
    process.exit(1);
  }

  const groqClient = new Groq({ apiKey });
  const app = createApp({ groqClient, security });

  if (tlsConfig && tlsConfig.ok) {
    let tlsCredentials;
    try {
      tlsCredentials = {
        cert: fs.readFileSync(tlsConfig.certPath),
        key: fs.readFileSync(tlsConfig.keyPath),
      };
    } catch (err) {
      const log = SERVER_CONFIG.LOG;
      console.error(
        `${log.MATCH_PROXY_PREFIX} ${log.TLS_READ_FAILED}`,
        err instanceof Error ? err.message : err
      );
      process.exit(1);
    }
    return https.createServer(tlsCredentials, app).listen(port, () => {
      console.log(
        `${SERVER_CONFIG.MESSAGES.SERVER_STARTED_HTTPS}${port}${SERVER_CONFIG.MESSAGES.SERVER_STARTED_HTTPS_TLS_SUFFIX}`
      );
    });
  }

  return app.listen(port, () => {
    console.log(`${SERVER_CONFIG.MESSAGES.SERVER_STARTED_HTTP}${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createRequestCacheKey,
  createApp,
  computeDeterministicScore,
  normalizeCandidates,
  scoreCandidatesDeterministically,
  startServer,
  stableStringify,
  parseJsonObject,
};
