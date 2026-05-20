package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchRequest;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class GroqMatchEvaluationServiceTest {

  @Autowired private GroqMatchEvaluationService evaluationService;

  @MockitoBean private GroqChatClient groqChatClient;

  @Test
  void returnsParsedGroqJsonPayload() {
    when(groqChatClient.complete(any()))
        .thenReturn("{\"scores\":[{\"id\":\"1\",\"matchScore\":90}]}");

    var result =
        evaluationService.evaluate(
            new MatchRequest(
                "Need Angular dev",
                List.of(new MatchCandidate("1", List.of("angular"), 3.0, "Developer")),
                false,
                null,
                0,
                1,
                42),
            List.of(new MatchCandidate("1", List.of("angular"), 3.0, "Developer")));

    assertTrue(result.has("scores"));
    assertEquals(90, result.get("scores").get(0).get("matchScore").asInt());
  }

  @Test
  void returnsEmptyObjectWhenGroqContentInvalid() {
    when(groqChatClient.complete(any())).thenReturn("not-json");

    var result =
        evaluationService.evaluate(
            new MatchRequest("Role", List.of(), false, null, 0, 1, 42), List.of());

    assertTrue(result.isObject());
    assertTrue(result.isEmpty());
  }
}
