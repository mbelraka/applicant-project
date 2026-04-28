const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const Groq = require('groq-sdk');

const {
  buildMatchRequestBody,
  SERVER_CONFIG,
  readServerEnv,
} = require('./server-config.cjs');
const { SERVER_REGEX } = require('./server-regex.cjs');

dotenv.config({ path: SERVER_CONFIG.ENV_FILE });

function parseJsonObject(value, fallback = {}) {
  if (!value || typeof value !== 'string') {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeCandidates(candidates) {
  return [...candidates]
    .map((candidate) => ({
      ...candidate,
      skills: Array.isArray(candidate?.skills)
        ? [...candidate.skills].map((skill) => String(skill)).sort()
        : [],
    }))
    .sort((a, b) => {
      const byId = String(a?.id ?? '').localeCompare(String(b?.id ?? ''));
      if (byId !== 0) {
        return byId;
      }
      return String(a?.name ?? '').localeCompare(String(b?.name ?? ''));
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
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(SERVER_REGEX.UNICODE_COMBINING_MARKS, '')
    .replace(SERVER_REGEX.NON_ALPHANUMERIC_TO_SPACE, ' ')
    .replace(SERVER_REGEX.WHITESPACE_RUN, ' ')
    .trim();
}

function tokenize(text) {
  return normalizeText(text)
    .split(' ')
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length >=
        SERVER_CONFIG.DETERMINISTIC.TEXT_NORMALIZATION.TOKEN_MIN_LENGTH
    );
}

function extractMinYearsExperience(jobDescription) {
  const match = String(jobDescription).match(SERVER_REGEX.MIN_YEARS_EXPERIENCE);
  if (!match) {
    return 0;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildDeterministicJobRequirements(jobDescription, candidates) {
  const jdTokens = new Set(tokenize(jobDescription));
  const skillPool = new Set(
    candidates.flatMap((candidate) =>
      Array.isArray(candidate.skills)
        ? candidate.skills.map((skill) => normalizeText(skill))
        : []
    )
  );
  const requiredSkills = [...skillPool]
    .filter((skill) => {
      if (!skill) {
        return false;
      }
      const parts = skill.split(' ').filter(Boolean);
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
  const normalizedSkills = Array.isArray(candidate.skills)
    ? candidate.skills.map((skill) => normalizeText(skill)).filter(Boolean)
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

  const years = Number(candidate.yearsOfExperience ?? 0);
  const experienceScore =
    jobRequirements.minYearsExperience > 0
      ? Math.min(years / jobRequirements.minYearsExperience, 1) *
        deterministicConfig.WEIGHTS.EXPERIENCE
      : deterministicConfig.WEIGHTS.EXPERIENCE;

  const jdText = normalizeText(jobRequirements.requiredSkills.join(' '));
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
    primaryStrengths.push(
      `${recommendationConfig.MATCHED_SKILLS_PREFIX}${matchingSkills
        .slice(0, recommendationConfig.MAX_SKILLS_LIST)
        .join(', ')}${recommendationConfig.PERIOD}`
    );
  }
  if (years > 0) {
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
          .join(', ')}${recommendationConfig.PERIOD}`
      : recommendationConfig.GAPS_NONE;

  const verdict =
    overall >= recommendationConfig.STRONG_THRESHOLD
      ? recommendationConfig.STRONG_VERDICT
      : overall >= recommendationConfig.MODERATE_THRESHOLD
        ? recommendationConfig.MODERATE_VERDICT
        : recommendationConfig.LIMITED_VERDICT;

  const recommendation = [...primaryStrengths, gaps, verdict].join(' ');

  return {
    id: String(candidate.id ?? ''),
    matchScore: overall,
    matchingSkills,
    missingSkills,
    candidateProfile: {
      skills: Array.isArray(candidate.skills) ? candidate.skills : [],
      yearsExperience: Number.isFinite(years) ? years : 0,
      topJobTitles: candidate.currentJobTitle
        ? [candidate.currentJobTitle]
        : [],
      education: '',
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

function createApp({ groqClient }) {
  const app = express();
  const responseCache = new Map();
  app.use(cors());
  app.use(express.json({ limit: SERVER_CONFIG.JSON_LIMIT }));

  app.get(SERVER_CONFIG.ROUTES.HEALTH, (_req, res) => {
    res.status(SERVER_CONFIG.STATUS.OK).json({ ok: true });
  });

  async function handleMatch(req, res) {
    const {
      jobDescription,
      candidates,
      model,
      temperature,
      topP,
      seed,
      deterministic,
    } = req.body || {};

    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(SERVER_CONFIG.STATUS.BAD_REQUEST).json({
        error: SERVER_CONFIG.MESSAGES.VALIDATION.JOB_DESCRIPTION_REQUIRED,
      });
      return;
    }
    if (!Array.isArray(candidates)) {
      res.status(SERVER_CONFIG.STATUS.BAD_REQUEST).json({
        error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATES_MUST_BE_ARRAY,
      });
      return;
    }

    const normalizedCandidates = normalizeCandidates(candidates);
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
      const raw = completion?.choices?.[0]?.message?.content || '{}';
      const parsed = parseJsonObject(raw);
      responseCache.set(cacheKey, parsed);
      res.json(parsed);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : SERVER_CONFIG.MESSAGES.GROQ_FAILED;
      res
        .status(SERVER_CONFIG.STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: message });
    }
  }

  app.post(SERVER_CONFIG.ROUTES.MATCH, handleMatch);
  app.post(SERVER_CONFIG.ROUTES.MATCH_LEGACY, handleMatch);

  return app;
}

function startServer() {
  const { port, apiKey } = readServerEnv();
  if (!apiKey) {
    console.error(SERVER_CONFIG.MESSAGES.MISSING_API_KEY);
    process.exit(1);
  }

  const groqClient = new Groq({ apiKey });
  const app = createApp({ groqClient });
  return app.listen(port, () => {
    console.log(`${SERVER_CONFIG.MESSAGES.SERVER_STARTED}${port}`);
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
