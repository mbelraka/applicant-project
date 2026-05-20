package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.recruita.api.config.properties.MatchProperties;
import org.junit.jupiter.api.Test;

class GroqSamplerParametersTest {

  @Test
  void clampsTemperatureAndTopPAndUsesDefaults() {
    MatchProperties.GroqProperties groq = new MatchProperties.GroqProperties();
    groq.setDefaultTemperature(0);
    groq.setDefaultTopP(1);
    groq.setDefaultSeed(42);

    assertEquals(0.5, GroqSamplerParameters.resolveTemperature(0.5, groq));
    assertEquals(1, GroqSamplerParameters.resolveTopP(2.0, groq));
    assertEquals(42, GroqSamplerParameters.resolveSeed(null, groq));
    assertEquals(0, GroqSamplerParameters.resolveTemperature(null, groq));
  }
}
