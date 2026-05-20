package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchCandidate;
import java.util.List;
import org.junit.jupiter.api.Test;

class GroqPromptBuilderTest {

  @Test
  void buildsUserPromptWithJobAndCandidates() {
    RecruitaProperties properties = new RecruitaProperties();
    properties.getMatch().getGroq().getPrompts().setUserLines(List.of("Analyze candidates."));
    GroqPromptBuilder builder = new GroqPromptBuilder(properties, new ObjectMapper());

    String prompt =
        builder.buildUserPrompt(
            "Backend engineer",
            List.of(new MatchCandidate("id-1", List.of("java"), 2.0, "Developer")));

    assertTrue(prompt.contains("Analyze candidates."));
    assertTrue(prompt.contains("Job description: Backend engineer"));
    assertTrue(prompt.contains("Candidates:"));
    assertTrue(prompt.contains("id-1"));
  }
}
