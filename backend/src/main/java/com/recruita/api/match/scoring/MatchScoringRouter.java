package com.recruita.api.match.scoring;

import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchScore;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MatchScoringRouter {

  private final List<MatchScoringStrategy> strategies;
  private final String noStrategyMessage;

  public MatchScoringRouter(List<MatchScoringStrategy> strategies, RecruitaProperties properties) {
    this.strategies = List.copyOf(strategies);
    this.noStrategyMessage = properties.getOperational().getStrategy().getNoMatchScoringStrategy();
  }

  public List<MatchScore> score(
      boolean deterministic, String jobDescription, List<MatchCandidate> candidates) {
    return strategies.stream()
        .filter(strategy -> strategy.supports(deterministic))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException(noStrategyMessage))
        .score(jobDescription, candidates);
  }
}
