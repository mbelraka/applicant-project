package com.recruita.api.match.scoring;

import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchScore;
import java.util.List;

public interface MatchScoringStrategy {

  boolean supports(boolean deterministic);

  List<MatchScore> score(String jobDescription, List<MatchCandidate> candidates);
}
