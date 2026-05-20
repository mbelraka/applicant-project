const path = require('path');
const { HTTP_STATUS } = require('./http-status.enum.cjs');
const {
  MATCH_CANDIDATE_FIELD,
  MATCH_CANDIDATE_FIELD_ALLOWLIST,
} = require('./constants/match-candidate-fields.cjs');
const {
  DETERMINISTIC_SCORE_WEIGHTS,
  DETERMINISTIC_SCORE_RANGE,
  GROQ_UNIT_INTERVAL,
  TITLE_ALIGNMENT_SUBSCORES,
  buildDeterministicRubricPromptLine,
  buildScoreIntegerBoundPromptLine,
} = require('./constants/deterministic-scoring.cjs');

/** Match UX / LLM system prompt — deterministic rubric + score-range lines are appended from numeric config. */
const MATCH_PROMPT_USER_LINES_CORE = Object.freeze([
  'You are an expert HR screener. Analyze the job description and all candidates.',
  'Candidate payloads are anonymized for privacy: each row uses a disposable request correlation id unrelated to backend or database keys — never treat those ids as real applicant identifiers.',
  'Each scores[] entry must use the correlation id string from its input candidate row exactly once; echo it unchanged.',
  'Do not infer or invent names, contacts, addresses, employers, schools, notes, or any other personal data.',
  'For each candidate, compute match score, matching skills, missing skills, candidate profile summary, and recommendation.',
  'Recommendation must be detailed (3-5 concise sentences) and include strengths, gaps, and a clear final assessment.',
  'Do not mention numeric scores or percentages inside recommendation text.',
]);

const MATCH_PROMPT_JSON_CONTRACT_LINE =
  'Respond strictly as valid JSON with this shape: {"scores":[{"id":"string","matchScore":number,"matchingSkills":string[],"missingSkills":string[],"candidateProfile":{"skills":string[],"yearsExperience":number,"topJobTitles":string[],"education":"string"},"recommendation":"string"}]}.';

const SERVER_CONFIG = {
  ENV_FILE: path.join(__dirname, '.env'),
  /** Match payloads are small JSON; keep tight to limit abuse and oversized prompts. */
  JSON_LIMIT: '512kb',
  DEFAULT_PORT: 3000,

  NODE_ENV_VALUES: Object.freeze({
    PRODUCTION: 'production',
  }),

  ENV_FLAG_TRUTHY: Object.freeze(['1', 'true']),

  /** Normalized booleans parsed from `.env`-style `"1"` / `"true"` flags. */
  isEnvTruthy: (raw) =>
    SERVER_CONFIG.ENV_FLAG_TRUTHY.includes(String(raw ?? '').trim()),

  /** Express / security middleware tuning (avoid scattering literals across `server.cjs`). */
  HTTP: Object.freeze({
    TRUST_PROXY_HOPS: 1,
    BODY_PARSE_JSON_ERROR_TYPES: Object.freeze([
      /** express.json() — invalid JSON POST body */
      'entity.parse.failed',
    ]),
    JSON_SYNTAX_HINT_PATTERN: /JSON/u,
    HELMET: Object.freeze({
      CONTENT_SECURITY_POLICY: false,
      CROSS_ORIGIN_EMBEDDER_POLICY: false,
      REFERRER_POLICY: 'strict-origin-when-cross-origin',
      FRAMEGUARD_ACTION: 'deny',
      /** Helmet `hsts.maxAge` is in seconds (not ms). */
      HSTS_MAX_AGE_SECONDS: 31_536_000,
      HSTS_INCLUDE_SUBDOMAINS: true,
      PERMISSIONS_POLICY: Object.freeze({
        features: Object.freeze({
          camera: Object.freeze([]),
          microphone: Object.freeze([]),
          geolocation: Object.freeze([]),
          payment: Object.freeze([]),
        }),
      }),
    }),
    RATE_LIMIT_SKIP_METHOD: 'OPTIONS',
  }),

  LOG: Object.freeze({
    MATCH_PROXY_PREFIX: '[match-proxy]',
    SERVER_PREFIX: '[server]',
    GROQ_ERROR: 'Groq error:',
    UNHANDLED_ERROR: 'Unhandled error:',
    TLS_READ_FAILED: 'Failed to read TLS cert/key:',
  }),

  HEALTH: Object.freeze({
    RESPONSE_BODY: Object.freeze({ ok: true }),
  }),

  GROQ_MESSAGE_ROLES: Object.freeze({
    SYSTEM: 'system',
    USER: 'user',
  }),

  MATCH_CANDIDATE_FIELD,

  CANDIDATE_SORT_KEYS: Object.freeze({
    ID: MATCH_CANDIDATE_FIELD.ID,
    SKILLS: MATCH_CANDIDATE_FIELD.SKILLS,
    /** Secondary sort for cache keys only (optional on anonymized rows). */
    NAME: 'name',
  }),

  /** Only these top-level keys are honored on `/api/match` (extras are dropped before validation). */
  MATCH_BODY_ALLOWED_KEYS: [
    'jobDescription',
    'candidates',
    'model',
    'temperature',
    'topP',
    'seed',
    'deterministic',
    'language',
    'locale',
  ],

  /** Fields kept from each candidate before validation and provider calls (defense in depth). */
  CANDIDATE_FIELD_ALLOWLIST: [...MATCH_CANDIDATE_FIELD_ALLOWLIST],

  /** Local `ng serve` + common dev hosts — override with comma-separated `CORS_ORIGIN` or `*` (open, demo only). */
  CORS: {
    DEFAULT_DEV_ORIGINS: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    METHODS: Object.freeze(['GET', 'HEAD', 'POST']),
    ALLOWED_HEADERS: Object.freeze(['Content-Type']),
    MAX_AGE_SECONDS: 86_400,
    OPTIONS_SUCCESS_STATUS: 204,
    CREDENTIALS: false,
    WILDCARD_ORIGIN: '*',
    ORIGIN_SEPARATOR: ',',
  },

  MATCH_RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    DEFAULT_MAX: 100,
    /** Hard cap for `MATCH_RATE_LIMIT_MAX` even if env sets an extreme value. */
    MAX_REQUESTS_CEILING: 10_000,
    MESSAGE: 'Too many match requests from this IP, please try again later.',
  },

  /**
   * Hard limits on /api/match body (denial-of-service / prompt-injection containment).
   * Aligns with OWASP ASVS handling of untrusted payloads.
   */
  REQUEST_LIMITS: {
    JOB_DESCRIPTION_MAX_CHARS: 24_576,
    CANDIDATES_MAX_COUNT: 250,
    /** Per scalar text field coerced via String(value). */
    CANDIDATE_SCALAR_MAX_CHARS: 4096,
    SKILL_COUNT_MAX: 120,
    SKILL_ITEM_MAX_CHARS: 256,
  },

  /** Groq SDK model slug — block odd characters early (injection/confusion defence in depth). */
  GROQ_MODEL_PATTERN: /^[a-zA-Z0-9._-]{1,96}$/,

  STATUS: HTTP_STATUS,
  ROUTES: {
    HEALTH: '/api/health',
    MATCH: '/api/match',
    MATCH_LEGACY: '/api/match-job',
  },
  GROQ: {
    DEFAULT_MODEL: 'llama-3.3-70b-versatile',
    DEFAULT_TEMPERATURE: 0,
    DEFAULT_TOP_P: 1,
    DEFAULT_SEED: 42,
    RESPONSE_FORMAT_TYPE: 'json_object',
    UNIT_INTERVAL: GROQ_UNIT_INTERVAL,
    /** Used when the provider returns empty/omitted message content or JSON parse fails in `parseJsonObject`. */
    EMPTY_JSON_OBJECT_LITERAL: '{}',
  },
  MESSAGES: {
    TLS_PATHS_INCOMPLETE:
      'Both TLS_CERT_PATH and TLS_KEY_PATH must be set to enable HTTPS in Node.',
    PRODUCTION_CORS_WILDCARD_FORBIDDEN:
      'Refusing to start: CORS_ORIGIN=* is not allowed when NODE_ENV=production. Set CORS_ORIGIN to your deployed front-end origin(s).',
    MISSING_API_KEY: 'Missing GROQ_API_KEY in environment.',
    SERVER_STARTED_HTTP: 'Match proxy (HTTP) listening on http://localhost:',
    SERVER_STARTED_HTTPS:
      'Match proxy (HTTPS/TLS) listening on https://localhost:',
    SERVER_STARTED_HTTPS_TLS_SUFFIX: ' (NODE TLS)',
    VALIDATION: {
      JOB_DESCRIPTION_REQUIRED: 'jobDescription is required.',
      JOB_DESCRIPTION_TOO_LONG:
        'jobDescription exceeds maximum allowed length.',
      CANDIDATES_MUST_BE_ARRAY: 'candidates must be an array.',
      TOO_MANY_CANDIDATES: 'Too many candidates in one request.',
      CANDIDATE_NOT_OBJECT: 'Each candidate must be a JSON object.',
      CANDIDATE_ID_REQUIRED:
        'Each candidate must include a non-empty string id (correlation id).',
      CANDIDATE_FIELD_TOO_LONG: 'Candidate field exceeds maximum length.',
      CANDIDATE_YOE_INVALID:
        'Candidate yearsOfExperience must be a finite number.',
      CANDIDATE_SKILLS_INVALID: 'Candidate skills must be an array of strings.',
      MODEL_INVALID: 'Model parameter format is invalid.',
    },
    GROQ_FAILED: 'Groq request failed',
    /** Returned to browsers when NODE_ENV is production (avoid leaking provider errors). */
    GROQ_FAILED_CLIENT:
      'Matching service is temporarily unavailable. Please try again later.',
    INVALID_JSON_BODY: 'Request body must be valid JSON.',
    NOT_FOUND: 'Not found.',
    INTERNAL_ERROR_CLIENT:
      'The server encountered an error. Please try again later.',
  },
  PROMPTS: {
    SYSTEM:
      'You are an HR matching expert. Always respond with valid JSON only.',
    USER_LINE_JOINER: '\n\n',
    JOB_DESCRIPTION_LINE_PREFIX: 'Job description: ',
    CANDIDATES_JSON_LINE_PREFIX: 'Candidates: ',
    USER_LINES: Object.freeze([
      ...MATCH_PROMPT_USER_LINES_CORE,
      buildDeterministicRubricPromptLine(DETERMINISTIC_SCORE_WEIGHTS),
      buildScoreIntegerBoundPromptLine(DETERMINISTIC_SCORE_RANGE),
      MATCH_PROMPT_JSON_CONTRACT_LINE,
    ]),
  },
  DETERMINISTIC: {
    SCORE_RANGE: DETERMINISTIC_SCORE_RANGE,
    EXPERIENCE_RATIO_COMPARISON_CEILING: 1,
    WEIGHTS: DETERMINISTIC_SCORE_WEIGHTS,
    TITLE_ALIGNMENT_SCORES: Object.freeze({
      EXACT: TITLE_ALIGNMENT_SUBSCORES.EXACT_SHARE,
      PARTIAL: TITLE_ALIGNMENT_SUBSCORES.PARTIAL,
      LOW: TITLE_ALIGNMENT_SUBSCORES.LOW,
      DEFAULT: TITLE_ALIGNMENT_SUBSCORES.WHEN_NEITHER_MATCHES_JOB_TOKENS,
    }),
    TEXT_NORMALIZATION: {
      TOKEN_MIN_LENGTH: 2,
      SPLIT_DELIMITER: ' ',
      WHITESPACE_REPLACEMENT_IN_NORMALIZE_TEXT: ' ',
    },
    OUTPUT_DEFAULTS: {
      EMPTY_EDUCATION_STRING: '',
    },
    EXPERIENCE_PARSING: {
      /** Returned when JD does not advertise a numeric years requirement (regex miss / NaN). */
      MIN_YEARS_FALLBACK: 0,
      /** Numeric fallback when shaping scores if `yearsOfExperience` is absent from the anonymized candidate. */
      CANDIDATE_YOE_MISSING_NUMERIC_FALLBACK: 0,
    },
    RECOMMENDATION: {
      MAX_SKILLS_LIST: 5,
      GAPS_NONE:
        'Gaps: no critical skill gaps detected from parsed requirements.',
      STRONG_THRESHOLD: 85,
      MODERATE_THRESHOLD: 65,
      STRONG_VERDICT:
        'Overall assessment: strong fit and should be prioritized for interview.',
      MODERATE_VERDICT:
        'Overall assessment: moderate fit with clear upskilling areas.',
      LIMITED_VERDICT:
        'Overall assessment: limited fit for the current role requirements.',
      MATCHED_SKILLS_PREFIX: 'Matched skills: ',
      ROLE_ALIGNMENT_PREFIX: 'Role alignment: current title is ',
      GAPS_PREFIX: 'Gaps: missing ',
      PERIOD: '.',
      INLINE_SKILLS_JOINER: ', ',
      RECOMMENDATION_BLOCK_JOINER: ' ',
      EXPERIENCE_WITH_REQUIREMENT: (years, requiredYears) =>
        `Experience: ${years} years vs required ${requiredYears}.`,
      EXPERIENCE_SIMPLE: (years) => `Experience: ${years} years.`,
    },
  },
};

function toTemperature(input) {
  const parsed = Number(input);
  const clamp = SERVER_CONFIG.GROQ.UNIT_INTERVAL;
  if (!Number.isFinite(parsed)) {
    return SERVER_CONFIG.GROQ.DEFAULT_TEMPERATURE;
  }
  return Math.max(clamp.MIN, Math.min(clamp.MAX, parsed));
}

function toTopP(input) {
  const parsed = Number(input);
  const clamp = SERVER_CONFIG.GROQ.UNIT_INTERVAL;
  if (!Number.isFinite(parsed)) {
    return SERVER_CONFIG.GROQ.DEFAULT_TOP_P;
  }
  return Math.max(clamp.MIN, Math.min(clamp.MAX, parsed));
}

function toSeed(input) {
  const parsed = Number(input);
  if (!Number.isInteger(parsed)) {
    return SERVER_CONFIG.GROQ.DEFAULT_SEED;
  }
  return parsed;
}

function buildUserPrompt(jobDescription, candidates) {
  const P = SERVER_CONFIG.PROMPTS;
  return [
    ...P.USER_LINES,
    `${P.JOB_DESCRIPTION_LINE_PREFIX}${jobDescription.trim()}`,
    `${P.CANDIDATES_JSON_LINE_PREFIX}${JSON.stringify(candidates)}`,
  ].join(P.USER_LINE_JOINER);
}

/**
 * Whitelist candidate fields shared with deterministic scoring / external LLMs.
 * Strips names, contacts, addresses, HR free text, etc. (@see buildUserPrompt)
 */
function pickAnonymizedMatchCandidates(candidates) {
  const F = MATCH_CANDIDATE_FIELD;
  return candidates.map((c) => {
    const rawYoe = c?.[F.YEARS_OF_EXPERIENCE];
    const yoe = Number(rawYoe);
    return {
      [F.ID]: c[F.ID],
      [F.SKILLS]: Array.isArray(c?.[F.SKILLS]) ? [...c[F.SKILLS]] : [],
      [F.YEARS_OF_EXPERIENCE]: Number.isFinite(yoe) ? yoe : null,
      [F.CURRENT_JOB_TITLE]: c[F.CURRENT_JOB_TITLE] ?? '',
    };
  });
}

function buildMatchRequestBody({
  jobDescription,
  candidates,
  model,
  temperature,
  topP,
  seed,
}) {
  return {
    model: model || SERVER_CONFIG.GROQ.DEFAULT_MODEL,
    temperature: toTemperature(temperature),
    top_p: toTopP(topP),
    seed: toSeed(seed),
    messages: [
      {
        role: SERVER_CONFIG.GROQ_MESSAGE_ROLES.SYSTEM,
        content: SERVER_CONFIG.PROMPTS.SYSTEM,
      },
      {
        role: SERVER_CONFIG.GROQ_MESSAGE_ROLES.USER,
        content: buildUserPrompt(jobDescription, candidates),
      },
    ],
    response_format: {
      type: SERVER_CONFIG.GROQ.RESPONSE_FORMAT_TYPE,
    },
  };
}

/**
 * Drops unknown top-level keys so only the match contract is validated and forwarded internally.
 */
function pickMinimalMatchBody(body) {
  const src =
    body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const out = {};
  for (const key of SERVER_CONFIG.MATCH_BODY_ALLOWED_KEYS) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      out[key] = src[key];
    }
  }
  return out;
}

/** Per-candidate whitelist before validation (PII / unknown fields never enter validation or caches). */
function pickCandidateAllowlistFields(candidate) {
  const out = {};
  for (const key of SERVER_CONFIG.CANDIDATE_FIELD_ALLOWLIST) {
    if (Object.prototype.hasOwnProperty.call(candidate, key)) {
      out[key] = candidate[key];
    }
  }
  return out;
}

function scalarCoercedLength(value) {
  if (value === undefined || value === null) {
    return 0;
  }
  return String(value).length;
}

function validateGroqModelParameter(model) {
  if (model === undefined || model === null || model === '') {
    return { ok: true };
  }
  if (typeof model !== 'string') {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.VALIDATION.MODEL_INVALID,
    };
  }
  const trimmed = model.trim();
  if (!SERVER_CONFIG.GROQ_MODEL_PATTERN.test(trimmed)) {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.VALIDATION.MODEL_INVALID,
    };
  }
  return { ok: true };
}

/** OWASP-aligned validation for externally supplied JSON bodies. */
function validateMatchRequestPayload(rawBody) {
  const body = pickMinimalMatchBody(rawBody);
  const L = SERVER_CONFIG.REQUEST_LIMITS;
  const F = MATCH_CANDIDATE_FIELD;
  const source = body && typeof body === 'object' ? body : {};
  const { jobDescription, candidates, model } = source;

  if (!jobDescription || typeof jobDescription !== 'string') {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.VALIDATION.JOB_DESCRIPTION_REQUIRED,
    };
  }
  if (jobDescription.length > L.JOB_DESCRIPTION_MAX_CHARS) {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.VALIDATION.JOB_DESCRIPTION_TOO_LONG,
    };
  }

  if (!Array.isArray(candidates)) {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATES_MUST_BE_ARRAY,
    };
  }
  if (candidates.length > L.CANDIDATES_MAX_COUNT) {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.VALIDATION.TOO_MANY_CANDIDATES,
    };
  }

  const modelCheck = validateGroqModelParameter(model);
  if (!modelCheck.ok) {
    return modelCheck;
  }

  const sanitizedCandidates = [];

  for (const candidateRaw of candidates) {
    if (
      candidateRaw === null ||
      typeof candidateRaw !== 'object' ||
      Array.isArray(candidateRaw)
    ) {
      return {
        ok: false,
        error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_NOT_OBJECT,
      };
    }

    const candidate = pickCandidateAllowlistFields(candidateRaw);

    if (
      !Object.prototype.hasOwnProperty.call(candidate, F.ID) ||
      typeof candidate[F.ID] !== 'string' ||
      !candidate[F.ID].trim()
    ) {
      return {
        ok: false,
        error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_ID_REQUIRED,
      };
    }

    if (scalarCoercedLength(candidate[F.ID]) > L.CANDIDATE_SCALAR_MAX_CHARS) {
      return {
        ok: false,
        error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_FIELD_TOO_LONG,
      };
    }

    const titleVal = candidate[F.CURRENT_JOB_TITLE];
    if (titleVal !== undefined && titleVal !== null) {
      if (typeof titleVal !== 'string') {
        return {
          ok: false,
          error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_FIELD_TOO_LONG,
        };
      }
      if (scalarCoercedLength(titleVal) > L.CANDIDATE_SCALAR_MAX_CHARS) {
        return {
          ok: false,
          error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_FIELD_TOO_LONG,
        };
      }
    }

    const yoeRaw = candidate[F.YEARS_OF_EXPERIENCE];
    if (yoeRaw !== undefined && yoeRaw !== null) {
      if (typeof yoeRaw !== 'number' || !Number.isFinite(yoeRaw)) {
        return {
          ok: false,
          error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_YOE_INVALID,
        };
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(candidate, F.SKILLS) &&
      candidate[F.SKILLS] !== undefined &&
      candidate[F.SKILLS] !== null
    ) {
      if (!Array.isArray(candidate[F.SKILLS])) {
        return {
          ok: false,
          error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_SKILLS_INVALID,
        };
      }
      if (candidate[F.SKILLS].length > L.SKILL_COUNT_MAX) {
        return {
          ok: false,
          error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_SKILLS_INVALID,
        };
      }
      for (const skill of candidate[F.SKILLS]) {
        if (typeof skill !== 'string') {
          return {
            ok: false,
            error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_SKILLS_INVALID,
          };
        }
        if (skill.length > L.SKILL_ITEM_MAX_CHARS) {
          return {
            ok: false,
            error: SERVER_CONFIG.MESSAGES.VALIDATION.CANDIDATE_SKILLS_INVALID,
          };
        }
      }
    }

    sanitizedCandidates.push(candidate);
  }

  return {
    ok: true,
    jobDescription,
    candidates: sanitizedCandidates,
    model: source.model,
    temperature: source.temperature,
    topP: source.topP,
    seed: source.seed,
    deterministic: source.deterministic,
  };
}

function readServerEnv(env = process.env) {
  return {
    port: Number(env.PORT || SERVER_CONFIG.DEFAULT_PORT),
    apiKey: (env.GROQ_API_KEY || '').trim(),
  };
}

function readServerTlsEnv(env = process.env) {
  const cert = (env.TLS_CERT_PATH || '').trim();
  const key = (env.TLS_KEY_PATH || '').trim();
  if (!cert && !key) {
    return null;
  }
  if (!cert || !key) {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.TLS_PATHS_INCOMPLETE,
    };
  }
  return { ok: true, certPath: cert, keyPath: key };
}

/**
 * @param {NodeJS.ProcessEnv} env
 * @param {{ tlsActive?: boolean }} [options]
 */
function readServerSecurityEnv(env = process.env, options = {}) {
  const tlsActive = Boolean(options.tlsActive);
  const corsCfg = SERVER_CONFIG.CORS;

  const corsRaw = (env.CORS_ORIGIN || '').trim();

  /** @type {boolean | string[]} */
  let corsOriginOption;
  if (corsRaw === corsCfg.WILDCARD_ORIGIN) {
    corsOriginOption = true;
  } else if (corsRaw) {
    corsOriginOption = corsRaw
      .split(corsCfg.ORIGIN_SEPARATOR)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!corsOriginOption.length) {
      corsOriginOption = [...SERVER_CONFIG.CORS.DEFAULT_DEV_ORIGINS];
    }
  } else {
    corsOriginOption = [...SERVER_CONFIG.CORS.DEFAULT_DEV_ORIGINS];
  }

  const limitRaw = Number(env.MATCH_RATE_LIMIT_MAX);
  const matchRateLimitMax =
    Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.min(
          SERVER_CONFIG.MATCH_RATE_LIMIT.MAX_REQUESTS_CEILING,
          Math.floor(limitRaw)
        )
      : SERVER_CONFIG.MATCH_RATE_LIMIT.DEFAULT_MAX;

  const trustProxy = SERVER_CONFIG.isEnvTruthy(env.TRUST_PROXY);

  /** Enable only over HTTPS/TLS terminators — avoid HSTS on plain HTTP unless explicitly forced off. */
  const enableHsts =
    SERVER_CONFIG.isEnvTruthy(env.ENABLE_HSTS) ||
    (tlsActive && !SERVER_CONFIG.isEnvTruthy(env.DISABLE_HSTS));

  /** Only set preload with `HSTS_PRELOAD=1` when you intentionally submit host to the preload list. */
  const hstsPreload = SERVER_CONFIG.isEnvTruthy(env.HSTS_PRELOAD);

  return {
    corsOriginOption,
    matchRateLimitMax,
    trustProxy,
    enableHsts,
    hstsPreload,
  };
}

/** Production guardrails for the proxy (call from `startServer`). */
function validateMatchProxyStartup(env = process.env, security) {
  if (
    env.NODE_ENV === SERVER_CONFIG.NODE_ENV_VALUES.PRODUCTION &&
    security.corsOriginOption === true
  ) {
    return {
      ok: false,
      error: SERVER_CONFIG.MESSAGES.PRODUCTION_CORS_WILDCARD_FORBIDDEN,
    };
  }
  return { ok: true };
}

module.exports = {
  buildMatchRequestBody,
  pickAnonymizedMatchCandidates,
  pickMinimalMatchBody,
  SERVER_CONFIG,
  readServerEnv,
  readServerTlsEnv,
  readServerSecurityEnv,
  validateMatchRequestPayload,
  validateMatchProxyStartup,
};
