package com.recruita.api.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.api.dto.ErrorResponse;
import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.config.properties.SecurityProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class MatchRateLimitFilter extends OncePerRequestFilter {

  private final SecurityProperties.RateLimitProperties rateLimit;
  private final SecurityProperties.HttpProperties http;
  private final String matchPath;
  private final String matchLegacyPath;
  private final ObjectMapper objectMapper;
  private final Map<String, WindowCounter> counters = new ConcurrentHashMap<>();

  public MatchRateLimitFilter(RecruitaProperties properties, ObjectMapper objectMapper) {
    this.rateLimit = properties.getSecurity().getRateLimit();
    this.http = properties.getSecurity().getHttp();
    this.matchPath = properties.getApi().getRoutes().getMatchPath();
    this.matchLegacyPath = properties.getApi().getRoutes().getMatchLegacyPath();
    this.objectMapper = objectMapper;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    if (!http.getMatchRequestMethod().equalsIgnoreCase(request.getMethod())) {
      return true;
    }
    String path = request.getRequestURI();
    return !matchPath.equals(path) && !matchLegacyPath.equals(path);
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String clientKey = resolveClientKey(request);
    if (!counters.containsKey(clientKey)
        && counters.size() >= rateLimit.resolvedMaxDistinctClients()) {
      rejectRateLimited(response, rateLimit.getExceededMessage());
      return;
    }

    WindowCounter counter =
        counters.compute(
            clientKey, (key, existing) -> WindowCounter.rotate(existing, rateLimit.windowMillis()));

    int count = counter.count.incrementAndGet();
    int maxRequests = rateLimit.resolvedMaxRequests();
    writeRateLimitHeaders(
        response, maxRequests, Math.max(0, maxRequests - count), counter.windowStartEpochMs);

    if (count > maxRequests) {
      rejectRateLimited(response, rateLimit.getExceededMessage());
      return;
    }

    filterChain.doFilter(request, response);
  }

  private void rejectRateLimited(HttpServletResponse response, String message) throws IOException {
    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    objectMapper.writeValue(response.getOutputStream(), new ErrorResponse(message));
  }

  private String resolveClientKey(HttpServletRequest request) {
    return request.getRemoteAddr();
  }

  private void writeRateLimitHeaders(
      HttpServletResponse response, int limit, int remaining, long windowStartEpochMs) {
    long resetEpochSeconds =
        (windowStartEpochMs + rateLimit.windowMillis()) / http.getMillisecondsPerSecond();
    response.setHeader(rateLimit.getHeaderLimit(), String.valueOf(limit));
    response.setHeader(rateLimit.getHeaderRemaining(), String.valueOf(remaining));
    response.setHeader(rateLimit.getHeaderReset(), String.valueOf(resetEpochSeconds));
  }

  private static final class WindowCounter {
    private final long windowStartEpochMs;
    private final AtomicInteger count;

    private WindowCounter(long windowStartEpochMs, AtomicInteger count) {
      this.windowStartEpochMs = windowStartEpochMs;
      this.count = count;
    }

    private static WindowCounter rotate(WindowCounter existing, long windowMs) {
      long now = Instant.now().toEpochMilli();
      if (existing == null || now - existing.windowStartEpochMs >= windowMs) {
        return new WindowCounter(now, new AtomicInteger(0));
      }
      return existing;
    }
  }
}
