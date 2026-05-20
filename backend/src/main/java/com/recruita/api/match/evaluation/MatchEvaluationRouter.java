package com.recruita.api.match.evaluation;

import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchRequest;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MatchEvaluationRouter {

  private final List<MatchEvaluationStrategy> strategies;
  private final String noStrategyMessage;

  public MatchEvaluationRouter(
      List<MatchEvaluationStrategy> strategies, RecruitaProperties properties) {
    this.strategies = List.copyOf(strategies);
    this.noStrategyMessage =
        properties.getOperational().getStrategy().getNoMatchEvaluationStrategy();
  }

  public MatchEvaluationResult evaluate(
      MatchRequest request, List<MatchCandidate> normalizedCandidates) {
    return strategies.stream()
        .filter(strategy -> strategy.supports(request.deterministic()))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException(noStrategyMessage))
        .evaluate(request, normalizedCandidates);
  }
}
