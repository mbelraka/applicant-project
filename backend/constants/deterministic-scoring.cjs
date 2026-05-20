/** Weights summed for overall deterministic score (must equal 100 — see prompts + rubric). */
const DETERMINISTIC_SCORE_WEIGHTS = Object.freeze({
  SKILL_MATCH: 40,
  EXPERIENCE: 30,
  TITLE_ALIGNMENT: 20,
  LOGISTICS: 10,
});

const DETERMINISTIC_SCORE_RANGE = Object.freeze({
  MIN: 0,
  MAX: 100,
});

/** Clamp for Groq sampler params coerced via `Number` (`temperature`, `top_p`). */
const GROQ_UNIT_INTERVAL = Object.freeze({ MIN: 0, MAX: 1 });

/** Title-vs-JD substring rubric tiers (deterministic only; sum ≤ WEIGHTS.TITLE_ALIGNMENT if max one applies). */
const TITLE_ALIGNMENT_SUBSCORES = Object.freeze({
  /** Full title-alignment weight — must match {@link DETERMINISTIC_SCORE_WEIGHTS}.TITLE_ALIGNMENT. */
  EXACT_SHARE: DETERMINISTIC_SCORE_WEIGHTS.TITLE_ALIGNMENT,
  PARTIAL: 12,
  LOW: 5,
  WHEN_NEITHER_MATCHES_JOB_TOKENS: 10,
});

function buildDeterministicRubricPromptLine(weights) {
  return (
    `Apply this deterministic rubric exactly and do not vary logic between runs: ` +
    `skill_match_score(${weights.SKILL_MATCH}), experience_score(${weights.EXPERIENCE}), ` +
    `title_alignment_score(${weights.TITLE_ALIGNMENT}), logistics_score(${weights.LOGISTICS}), ` +
    `overall_score=rounded sum.`
  );
}

function buildScoreIntegerBoundPromptLine(range) {
  return `Scores must be integers between ${range.MIN} and ${range.MAX}.`;
}

module.exports = {
  DETERMINISTIC_SCORE_WEIGHTS,
  DETERMINISTIC_SCORE_RANGE,
  GROQ_UNIT_INTERVAL,
  TITLE_ALIGNMENT_SUBSCORES,
  buildDeterministicRubricPromptLine,
  buildScoreIntegerBoundPromptLine,
};
