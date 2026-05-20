package com.recruita.api.match.evaluation;

import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchRequest;
import java.util.List;

public interface MatchEvaluationStrategy {

  boolean supports(boolean deterministic);

  MatchEvaluationResult evaluate(MatchRequest request, List<MatchCandidate> normalizedCandidates);
}
