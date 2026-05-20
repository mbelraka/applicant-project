package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.common.exception.MatchServiceUnavailableException;
import com.recruita.api.config.properties.RecruitaProperties;
import org.junit.jupiter.api.Test;

class RestGroqChatClientTest {

  @Test
  void refusesCallWhenApiKeyMissing() {
    RecruitaProperties properties = new RecruitaProperties();
    properties.getMatch().getGroq().setApiKey("");
    RestGroqChatClient client = new RestGroqChatClient(properties, new ObjectMapper());

    assertThrows(
        MatchServiceUnavailableException.class,
        () -> client.complete(new GroqChatCompletionRequest("model", 0, 1, 42, "system", "user")));
  }
}
