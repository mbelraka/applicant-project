package com.recruita.api.config.startup;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.recruita.api.config.properties.MatchProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import org.junit.jupiter.api.Test;

class GroqApiKeyEnvironmentValidatorTest {

  @Test
  void allowsStartupWhenApiKeyConfigured() {
    RecruitaProperties properties = new RecruitaProperties();
    MatchProperties.GroqProperties groq = properties.getMatch().getGroq();
    groq.setRequireApiKeyAtStartup(true);
    groq.setApiKey("configured");

    GroqApiKeyEnvironmentValidator validator = new GroqApiKeyEnvironmentValidator(properties);
    assertDoesNotThrow(validator::validateApiKeyPresent);
  }

  @Test
  void refusesStartupWhenApiKeyMissing() {
    RecruitaProperties properties = new RecruitaProperties();
    MatchProperties.GroqProperties groq = properties.getMatch().getGroq();
    groq.setRequireApiKeyAtStartup(true);
    groq.setApiKey("");

    GroqApiKeyEnvironmentValidator validator = new GroqApiKeyEnvironmentValidator(properties);
    assertThrows(IllegalStateException.class, validator::validateApiKeyPresent);
  }
}
