package com.recruita.api.match.groq;

import com.recruita.api.common.math.NumericRanges;
import com.recruita.api.config.properties.GroqApiContractProperties;
import com.recruita.api.config.properties.MatchProperties;

public final class GroqSamplerParameters {

  private GroqSamplerParameters() {}

  public static double resolveTemperature(Double input, MatchProperties.GroqProperties groq) {
    GroqApiContractProperties.SamplerUnitIntervalProperties interval =
        groq.getApiContract().getSamplerUnitInterval();
    if (input == null || !Double.isFinite(input)) {
      return groq.getDefaultTemperature();
    }
    return NumericRanges.clamp(input, interval.getMin(), interval.getMax());
  }

  public static double resolveTopP(Double input, MatchProperties.GroqProperties groq) {
    GroqApiContractProperties.SamplerUnitIntervalProperties interval =
        groq.getApiContract().getSamplerUnitInterval();
    if (input == null || !Double.isFinite(input)) {
      return groq.getDefaultTopP();
    }
    return NumericRanges.clamp(input, interval.getMin(), interval.getMax());
  }

  public static int resolveSeed(Integer input, MatchProperties.GroqProperties groq) {
    if (input == null) {
      return groq.getDefaultSeed();
    }
    return input;
  }
}
