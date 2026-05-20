package com.recruita.api.api.dto.match;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MatchRequestDto(
    String jobDescription,
    @NotNull(message = "{recruita.match.validation.candidates-must-be-array}")
        List<@Valid MatchCandidateDto> candidates,
    Boolean deterministic,
    String model,
    Double temperature,
    Double topP,
    Integer seed,
    String language,
    String locale) {

  public MatchRequestDto {
    candidates = List.copyOf(candidates);
  }

  public boolean isDeterministic() {
    return Boolean.TRUE.equals(deterministic);
  }
}
