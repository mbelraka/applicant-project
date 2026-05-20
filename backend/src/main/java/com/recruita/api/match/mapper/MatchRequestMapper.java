package com.recruita.api.match.mapper;

import com.recruita.api.api.dto.match.MatchCandidateDto;
import com.recruita.api.api.dto.match.MatchRequestDto;
import com.recruita.api.config.properties.MatchProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchRequest;
import com.recruita.api.match.groq.GroqSamplerParameters;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MatchRequestMapper {

  private final MatchProperties.GroqProperties groq;

  public MatchRequestMapper(RecruitaProperties properties) {
    this.groq = properties.getMatch().getGroq();
  }

  public MatchRequest toDomain(MatchRequestDto dto) {
    List<MatchCandidate> candidates =
        dto.candidates().stream().map(this::toDomainCandidate).toList();
    return new MatchRequest(
        dto.jobDescription(),
        candidates,
        dto.isDeterministic(),
        dto.model(),
        GroqSamplerParameters.resolveTemperature(dto.temperature(), groq),
        GroqSamplerParameters.resolveTopP(dto.topP(), groq),
        GroqSamplerParameters.resolveSeed(dto.seed(), groq));
  }

  private MatchCandidate toDomainCandidate(MatchCandidateDto dto) {
    return new MatchCandidate(
        dto.id(),
        dto.skills() == null ? List.of() : dto.skills(),
        dto.yearsOfExperience(),
        dto.currentJobTitle() == null ? "" : dto.currentJobTitle());
  }
}
