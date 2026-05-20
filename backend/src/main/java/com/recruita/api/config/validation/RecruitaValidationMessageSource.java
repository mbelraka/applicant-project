package com.recruita.api.config.validation;

import com.recruita.api.config.properties.MatchProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import java.text.MessageFormat;
import java.util.Locale;
import org.springframework.context.support.AbstractMessageSource;
import org.springframework.stereotype.Component;

/** Resolves Bean Validation message keys from {@link RecruitaProperties}. */
@Component
public class RecruitaValidationMessageSource extends AbstractMessageSource {

  public static final String CANDIDATES_MUST_BE_ARRAY_KEY =
      "recruita.match.validation.candidates-must-be-array";
  public static final String CANDIDATE_ID_REQUIRED_KEY =
      "recruita.match.validation.candidate-id-required";

  private final MatchProperties.MessageProperties messages;

  public RecruitaValidationMessageSource(RecruitaProperties properties) {
    this.messages = properties.getMatch().getMessages();
  }

  @Override
  protected MessageFormat resolveCode(String code, Locale locale) {
    String message =
        switch (code) {
          case CANDIDATES_MUST_BE_ARRAY_KEY -> messages.getCandidatesMustBeArray();
          case CANDIDATE_ID_REQUIRED_KEY -> messages.getCandidateIdRequired();
          default -> null;
        };
    if (message == null) {
      return null;
    }
    return createMessageFormat(message, locale);
  }
}
