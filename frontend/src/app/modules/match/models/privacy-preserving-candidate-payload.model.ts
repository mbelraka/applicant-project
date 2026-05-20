/** Fields allowed on the wire to the match proxy / LLM (plus an ephemeral correlation id). */
export interface PrivacyPreservingCandidatePayload {
  id: string;
  skills: string[];
  yearsOfExperience: number | null;
  currentJobTitle: string;
}
