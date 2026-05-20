package com.recruita.api.api.dto.match;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record MatchResponseDto(List<MatchScoreDto> scores) {

  public MatchResponseDto {
    scores = scores == null ? List.of() : List.copyOf(scores);
  }
}
