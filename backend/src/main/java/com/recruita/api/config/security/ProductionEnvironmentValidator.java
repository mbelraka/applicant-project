package com.recruita.api.config.security;

import com.recruita.api.config.properties.RecruitaProperties;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ProductionEnvironmentValidator {

  private final RecruitaProperties properties;

  public ProductionEnvironmentValidator(RecruitaProperties properties) {
    this.properties = properties;
  }

  @EventListener(ApplicationReadyEvent.class)
  public void validateProductionCors() {
    if (properties.isProduction() && properties.getSecurity().getCors().allowsWildcard()) {
      throw new IllegalStateException(
          properties.getOperational().getStartup().getProductionCorsWildcardForbidden());
    }
  }
}
