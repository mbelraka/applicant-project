const path = require('path');
const { HTTP_STATUS } = require('./http-status.enum.cjs');

const SERVER_CONFIG = {
  ENV_FILE: path.join(__dirname, '.env'),
  JSON_LIMIT: '2mb',
  DEFAULT_PORT: 3000,
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
  },
  MESSAGES: {
    MISSING_API_KEY: 'Missing GROQ_API_KEY in environment.',
    SERVER_STARTED: 'Match proxy running on http://localhost:',
    VALIDATION: {
      JOB_DESCRIPTION_REQUIRED: 'jobDescription is required.',
      CANDIDATES_MUST_BE_ARRAY: 'candidates must be an array.',
    },
    GROQ_FAILED: 'Groq request failed',
  },
  PROMPTS: {
    SYSTEM:
      'You are an HR matching expert. Always respond with valid JSON only.',
    USER_LINES: [
      'You are an expert HR screener. Analyze the job description and all candidates.',
      'For each candidate, compute match score, matching skills, missing skills, candidate profile summary, and recommendation.',
      'Recommendation must be detailed (3-5 concise sentences) and include strengths, gaps, and a clear final assessment.',
      'Do not mention numeric scores or percentages inside recommendation text.',
      'Apply this deterministic rubric exactly and do not vary logic between runs: skill_match_score(40), experience_score(30), title_alignment_score(20), logistics_score(10), overall_score=rounded sum.',
      'Scores must be integers between 0 and 100.',
      'Respond strictly as valid JSON with this shape: {"scores":[{"id":"string","matchScore":number,"matchingSkills":string[],"missingSkills":string[],"candidateProfile":{"skills":string[],"yearsExperience":number,"topJobTitles":string[],"education":"string"},"recommendation":"string"}]}.',
    ],
  },
  DETERMINISTIC: {
    SCORE_RANGE: {
      MIN: 0,
      MAX: 100,
    },
    WEIGHTS: {
      SKILL_MATCH: 40,
      EXPERIENCE: 30,
      TITLE_ALIGNMENT: 20,
      LOGISTICS: 10,
    },
    TITLE_ALIGNMENT_SCORES: {
      EXACT: 20,
      PARTIAL: 12,
      LOW: 5,
      DEFAULT: 10,
    },
    TEXT_NORMALIZATION: {
      TOKEN_MIN_LENGTH: 2,
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
      EXPERIENCE_WITH_REQUIREMENT: (years, requiredYears) =>
        `Experience: ${years} years vs required ${requiredYears}.`,
      EXPERIENCE_SIMPLE: (years) => `Experience: ${years} years.`,
    },
  },
};

function toTemperature(input) {
  const parsed = Number(input);
  if (!Number.isFinite(parsed)) {
    return SERVER_CONFIG.GROQ.DEFAULT_TEMPERATURE;
  }
  return Math.max(0, Math.min(1, parsed));
}

function toTopP(input) {
  const parsed = Number(input);
  if (!Number.isFinite(parsed)) {
    return SERVER_CONFIG.GROQ.DEFAULT_TOP_P;
  }
  return Math.max(0, Math.min(1, parsed));
}

function toSeed(input) {
  const parsed = Number(input);
  if (!Number.isInteger(parsed)) {
    return SERVER_CONFIG.GROQ.DEFAULT_SEED;
  }
  return parsed;
}

function buildUserPrompt(jobDescription, candidates) {
  return [
    ...SERVER_CONFIG.PROMPTS.USER_LINES,
    `Job description: ${jobDescription.trim()}`,
    `Candidates: ${JSON.stringify(candidates)}`,
  ].join('\n\n');
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
        role: 'system',
        content: SERVER_CONFIG.PROMPTS.SYSTEM,
      },
      { role: 'user', content: buildUserPrompt(jobDescription, candidates) },
    ],
    response_format: {
      type: SERVER_CONFIG.GROQ.RESPONSE_FORMAT_TYPE,
    },
  };
}

function readServerEnv(env = process.env) {
  return {
    port: Number(env.PORT || SERVER_CONFIG.DEFAULT_PORT),
    apiKey: (env.GROQ_API_KEY || '').trim(),
  };
}

module.exports = {
  buildMatchRequestBody,
  SERVER_CONFIG,
  readServerEnv,
};
