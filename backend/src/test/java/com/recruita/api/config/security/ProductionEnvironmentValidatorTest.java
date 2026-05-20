package com.recruita.api.config.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.recruita.api.config.properties.RecruitaProperties;
import org.junit.jupiter.api.Test;

class ProductionEnvironmentValidatorTest {

  @Test
  void allowsDevelopmentWithWildcardCors() {
    RecruitaProperties properties = new RecruitaProperties();
    properties.getRuntime().setProductionMode("development");
    properties.getSecurity().getCors().setAllowedOrigins("*");

    ProductionEnvironmentValidator validator = new ProductionEnvironmentValidator(properties);
    assertDoesNotThrow(validator::validateProductionCors);
  }

  @Test
  void refusesProductionWithWildcardCors() {
    RecruitaProperties properties = new RecruitaProperties();
    properties.getRuntime().setProductionMode("production");
    properties.getSecurity().getCors().setAllowedOrigins("*");

    ProductionEnvironmentValidator validator = new ProductionEnvironmentValidator(properties);
    assertThrows(IllegalStateException.class, validator::validateProductionCors);
  }
}
