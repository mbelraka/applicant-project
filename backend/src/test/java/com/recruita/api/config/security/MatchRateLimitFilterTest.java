package com.recruita.api.config.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;

@SpringBootTest
class MatchRateLimitFilterTest {

  @Autowired private MatchRateLimitFilter filter;

  @Test
  void filtersPostMatchEndpointsOnly() {
    assertFalse(shouldNotFilter("POST", "/api/match"));
    assertFalse(shouldNotFilter("POST", "/api/match-job"));
    assertTrue(shouldNotFilter("GET", "/api/health"));
    assertTrue(shouldNotFilter("POST", "/api/health"));
  }

  private boolean shouldNotFilter(String method, String path) {
    MockHttpServletRequest request = new MockHttpServletRequest(method, path);
    return filter.shouldNotFilter(request);
  }

  @Test
  void usesForwardedForHeaderAsClientKey() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getMethod()).thenReturn("POST");
    when(request.getRequestURI()).thenReturn("/api/match");
    when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 198.51.100.2");
    when(request.getRemoteAddr()).thenReturn("127.0.0.1");

    assertFalse(filter.shouldNotFilter(request));
  }
}
