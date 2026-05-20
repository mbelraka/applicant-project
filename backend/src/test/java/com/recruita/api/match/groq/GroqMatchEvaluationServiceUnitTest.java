package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.recruita.api.common.exception.MatchServiceUnavailableException;
import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchRequest;
import java.util.List;
import org.junit.jupiter.api.Test;

class GroqMatchEvaluationServiceUnitTest {

  @Test
  void suppressesProviderErrorsInProduction() {
    RecruitaProperties properties = new RecruitaProperties();
    properties.getRuntime().setProductionMode("production");
    GroqPromptBuilder promptBuilder =
        new GroqPromptBuilder(properties, new com.fasterxml.jackson.databind.ObjectMapper());
    GroqJsonResponseParser parser =
        new GroqJsonResponseParser(properties, new com.fasterxml.jackson.databind.ObjectMapper());
    GroqMatchEvaluationService service =
        new GroqMatchEvaluationService(
            request -> {
              throw new RuntimeException("provider exploded");
            },
            promptBuilder,
            parser,
            properties);

    MatchServiceUnavailableException ex =
        assertThrows(
            MatchServiceUnavailableException.class,
            () ->
                service.evaluate(
                    new MatchRequest("Role", List.of(), false, null, 0, 1, 42), List.of()));

    assertEquals("provider exploded", ex.getMessage());
    assertTrue(ex.suppressDetail());
  }
}
