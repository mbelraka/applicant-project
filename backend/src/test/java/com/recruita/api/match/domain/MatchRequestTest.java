package com.recruita.api.match.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class MatchRequestTest {

  @Test
  void resolvesDefaultOrExplicitModel() {
    MatchRequest missingModel = new MatchRequest("  role  ", List.of(), false, null, 0, 1, 42);
    MatchRequest blankModel = new MatchRequest("role", List.of(), false, "  ", 0, 1, 42);
    MatchRequest explicitModel = new MatchRequest("role", List.of(), false, " custom ", 0, 1, 42);

    assertEquals("role", missingModel.jobDescription());
    assertEquals("llama-3.3-70b-versatile", missingModel.resolvedModel("llama-3.3-70b-versatile"));
    assertEquals("llama-3.3-70b-versatile", blankModel.resolvedModel("llama-3.3-70b-versatile"));
    assertEquals("custom", explicitModel.resolvedModel("llama-3.3-70b-versatile"));
  }
}
