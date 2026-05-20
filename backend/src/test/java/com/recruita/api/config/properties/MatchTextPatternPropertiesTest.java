package com.recruita.api.config.properties;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MatchTextPatternPropertiesTest {

  @Autowired private RecruitaProperties properties;

  @Test
  void bindsDeterministicTextPatternsFromApplicationYaml() {
    MatchProperties.DeterministicProperties.TextProperties text =
        properties.getMatch().getDeterministic().getText();

    assertEquals("(\\d+)\\s*\\+?\\s*years?", text.getMinYearsRegex());
    assertEquals("[^a-z0-9]+", text.getNonAlphanumericRegex());
    assertEquals("\\s+", text.getWhitespaceRegex());
    assertEquals("\\p{M}+", text.getCombiningMarksRegex());

    assertDoesNotThrow(() -> Pattern.compile(text.getMinYearsRegex(), Pattern.CASE_INSENSITIVE));
    assertDoesNotThrow(() -> Pattern.compile(text.getNonAlphanumericRegex()));
    assertDoesNotThrow(() -> Pattern.compile(text.getWhitespaceRegex()));
    assertDoesNotThrow(() -> Pattern.compile(text.getCombiningMarksRegex()));
  }
}
