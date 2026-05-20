package com.recruita.api.match.validation;

import com.recruita.api.common.exception.MatchValidationException;
import com.recruita.api.config.properties.RecruitaProperties;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class GroqModelPolicyValidator {

  private final Pattern modelPattern;
  private final String invalidMessage;

  public GroqModelPolicyValidator(RecruitaProperties properties) {
    String pattern = properties.getMatch().getGroq().getModelPattern();
    this.modelPattern = Pattern.compile(pattern);
    this.invalidMessage = properties.getMatch().getMessages().getModelInvalid();
  }

  public void validate(String model) {
    if (model == null || model.isBlank()) {
      return;
    }
    if (!modelPattern.matcher(model.trim()).matches()) {
      throw new MatchValidationException(invalidMessage);
    }
  }
}
