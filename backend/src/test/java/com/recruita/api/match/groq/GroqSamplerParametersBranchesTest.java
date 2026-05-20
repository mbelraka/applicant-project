package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.recruita.api.config.properties.MatchProperties;
import org.junit.jupiter.api.Test;

class GroqSamplerParametersBranchesTest {

  @Test
  void resolvesFallbacksAndClamps() {
    MatchProperties.GroqProperties groq = new MatchProperties.GroqProperties();
    groq.setDefaultTemperature(0.2);
    groq.setDefaultTopP(0.8);
    groq.setDefaultSeed(42);

    assertEquals(0.2, GroqSamplerParameters.resolveTemperature(null, groq));
    assertEquals(0.2, GroqSamplerParameters.resolveTemperature(Double.NaN, groq));
    assertEquals(1, GroqSamplerParameters.resolveTemperature(5.0, groq));
    assertEquals(0, GroqSamplerParameters.resolveTopP(-1.0, groq));
    assertEquals(42, GroqSamplerParameters.resolveSeed(null, groq));
    assertEquals(7, GroqSamplerParameters.resolveSeed(7, groq));
  }
}
