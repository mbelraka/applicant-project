package com.recruita.api.match.groq;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.config.properties.MatchProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchCandidate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class GroqPromptBuilder {

  private final MatchProperties.GroqProperties groq;
  private final ObjectMapper objectMapper;
  private final String serializationFailedMessage;

  public GroqPromptBuilder(RecruitaProperties properties, ObjectMapper objectMapper) {
    this.groq = properties.getMatch().getGroq();
    this.objectMapper = objectMapper;
    this.serializationFailedMessage =
        properties.getOperational().getStrategy().getGroqPromptSerializationFailed();
  }

  public String buildUserPrompt(String jobDescription, List<MatchCandidate> candidates) {
    MatchProperties.GroqProperties.PromptProperties prompts = groq.getPrompts();
    List<String> lines = new ArrayList<>(prompts.getUserLines());
    lines.add(prompts.getJobDescriptionLinePrefix() + jobDescription.trim());
    try {
      lines.add(
          prompts.getCandidatesJsonLinePrefix()
              + objectMapper.writeValueAsString(toPromptCandidates(candidates)));
    } catch (JsonProcessingException ex) {
      throw new IllegalStateException(serializationFailedMessage, ex);
    }
    return String.join(prompts.getUserLineJoiner(), lines);
  }

  public String systemPrompt() {
    return groq.getPrompts().getSystem();
  }

  private static List<PromptCandidate> toPromptCandidates(List<MatchCandidate> candidates) {
    return candidates.stream()
        .map(
            candidate ->
                new PromptCandidate(
                    candidate.correlationId(),
                    candidate.skills(),
                    candidate.yearsOfExperience(),
                    candidate.currentJobTitle()))
        .toList();
  }

  private record PromptCandidate(
      String id, List<String> skills, Double yearsOfExperience, String currentJobTitle) {}
}
