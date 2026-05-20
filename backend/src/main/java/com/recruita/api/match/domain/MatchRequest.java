package com.recruita.api.match.domain;

import java.util.List;

public record MatchRequest(
    String jobDescription,
    List<MatchCandidate> candidates,
    boolean deterministic,
    String model,
    double temperature,
    double topP,
    int seed) {

  public MatchRequest {
    candidates = List.copyOf(candidates);
    jobDescription = jobDescription.trim();
  }

  public String resolvedModel(String defaultModel) {
    if (model == null || model.isBlank()) {
      return defaultModel;
    }
    return model.trim();
  }
}
