/**
 * Allowlisted candidate payload keys forwarded to deterministic scoring / LLM prompts.
 * All other incoming fields are stripped by `pickCandidateAllowlistFields` / anonymization.
 */
const MATCH_CANDIDATE_FIELD = Object.freeze({
  ID: 'id',
  SKILLS: 'skills',
  YEARS_OF_EXPERIENCE: 'yearsOfExperience',
  CURRENT_JOB_TITLE: 'currentJobTitle',
});

/** Stable iteration order for allowlist merges (prefer object field order parity with API docs). */
const MATCH_CANDIDATE_FIELD_ALLOWLIST = Object.freeze([
  MATCH_CANDIDATE_FIELD.ID,
  MATCH_CANDIDATE_FIELD.SKILLS,
  MATCH_CANDIDATE_FIELD.YEARS_OF_EXPERIENCE,
  MATCH_CANDIDATE_FIELD.CURRENT_JOB_TITLE,
]);

module.exports = {
  MATCH_CANDIDATE_FIELD,
  MATCH_CANDIDATE_FIELD_ALLOWLIST,
};
