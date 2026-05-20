package com.recruita.api.api.dto.match;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MatchCandidateDto(
    @NotBlank(message = "{recruita.match.validation.candidate-id-required}") String id,
    List<@NotBlank String> skills,
    @PositiveOrZero Double yearsOfExperience,
    String currentJobTitle) {

  public MatchCandidateDto {
    skills = skills == null ? List.of() : List.copyOf(skills);
  }
}
