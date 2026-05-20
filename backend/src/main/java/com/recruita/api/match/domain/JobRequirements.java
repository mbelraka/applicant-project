package com.recruita.api.match.domain;

import java.util.List;

public record JobRequirements(List<String> requiredSkills, double minYearsExperience) {

  public JobRequirements {
    requiredSkills = List.copyOf(requiredSkills);
  }
}
