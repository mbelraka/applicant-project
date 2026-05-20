package com.recruita.api.api.advice;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.recruita.api.common.exception.MatchServiceUnavailableException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ProblemDetail;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "recruita.runtime.suppress-error-detail=false")
class GlobalApiExceptionHandlerVerboseTest {

  @Autowired private GlobalApiExceptionHandler handler;

  @Test
  void handleUnavailableReturnsExplicitMessageWhenAllowed() {
    ProblemDetail detail =
        handler.handleUnavailable(new MatchServiceUnavailableException("provider timeout", false));

    assertEquals("provider timeout", detail.getProperties().get("error"));
  }

  @Test
  void handleGenericReturnsExceptionMessageInDevelopment() {
    ProblemDetail detail = handler.handleGeneric(new IllegalStateException("boom"));
    assertEquals("boom", detail.getProperties().get("error"));
  }

  @Test
  void handleUnavailableHonorsExceptionLevelSuppressFlag() {
    ProblemDetail detail =
        handler.handleUnavailable(new MatchServiceUnavailableException("internal", true));

    assertEquals(
        "Matching service is temporarily unavailable. Please try again later.",
        detail.getProperties().get("error"));
  }
}
