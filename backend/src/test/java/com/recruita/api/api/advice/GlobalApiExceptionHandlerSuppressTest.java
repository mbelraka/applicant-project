package com.recruita.api.api.advice;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.recruita.api.common.exception.MatchServiceUnavailableException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ProblemDetail;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "recruita.runtime.suppress-error-detail=true")
class GlobalApiExceptionHandlerSuppressTest {

  @Autowired private GlobalApiExceptionHandler handler;

  @Test
  void handleGenericUsesInternalMessageWhenSuppressed() {
    ProblemDetail detail = handler.handleGeneric(new RuntimeException("secret-detail"));
    assertEquals(
        "The server encountered an error. Please try again later.",
        detail.getProperties().get("error"));
  }

  @Test
  void handleUnavailableUsesPublicMessageWhenSuppressed() {
    ProblemDetail detail =
        handler.handleUnavailable(new MatchServiceUnavailableException("internal detail", false));

    assertEquals(
        "Matching service is temporarily unavailable. Please try again later.",
        detail.getProperties().get("error"));
  }
}
