package com.recruita.api.match.mapper;

import com.recruita.api.api.dto.match.MatchResponseDto;
import com.recruita.api.api.dto.match.MatchScoreDto;
import com.recruita.api.match.domain.MatchScore;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MatchResponseMapper {

  public MatchResponseDto toDto(List<MatchScore> scores) {
    return new MatchResponseDto(scores.stream().map(this::toDto).toList());
  }

  private MatchScoreDto toDto(MatchScore score) {
    return new MatchScoreDto(
        score.correlationId(),
        score.matchScore(),
        score.matchingSkills(),
        score.missingSkills(),
        new MatchScoreDto.CandidateProfileDto(
            score.candidateProfile().skills(),
            score.candidateProfile().yearsExperience(),
            score.candidateProfile().topJobTitles(),
            score.candidateProfile().education()),
        score.recommendation());
  }
}
