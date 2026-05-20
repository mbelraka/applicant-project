package com.recruita.api.match.domain;

import java.util.List;

public record MatchCandidate(
    String correlationId, List<String> skills, Double yearsOfExperience, String currentJobTitle) {

  public MatchCandidate {
    skills = skills == null ? List.of() : List.copyOf(skills);
    currentJobTitle = currentJobTitle == null ? "" : currentJobTitle;
  }
}
