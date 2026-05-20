package com.recruita.api.common.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class MatchExceptionsTest {

  @Test
  void validationExceptionCarriesMessage() {
    MatchValidationException ex = new MatchValidationException("invalid");
    assertEquals("invalid", ex.getMessage());
  }

  @Test
  void serviceUnavailableHonorsSuppressFlag() {
    MatchServiceUnavailableException suppressed =
        new MatchServiceUnavailableException("detail", true);
    assertTrue(suppressed.suppressDetail());

    MatchServiceUnavailableException verbose =
        new MatchServiceUnavailableException("detail", false);
    assertFalse(verbose.suppressDetail());
  }
}
