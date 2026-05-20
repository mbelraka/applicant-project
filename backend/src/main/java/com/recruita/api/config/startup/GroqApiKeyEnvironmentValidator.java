package com.recruita.api.config.startup;

import com.recruita.api.config.properties.RecruitaProperties;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class GroqApiKeyEnvironmentValidator {

  private final RecruitaProperties properties;

  public GroqApiKeyEnvironmentValidator(RecruitaProperties properties) {
    this.properties = properties;
  }

  @EventListener(ApplicationReadyEvent.class)
  public void validateApiKeyPresent() {
    var groq = properties.getMatch().getGroq();
    if (groq.isRequireApiKeyAtStartup() && groq.getApiKey().isBlank()) {
      throw new IllegalStateException(
          properties.getOperational().getStartup().getMissingGroqApiKey());
    }
  }
}
