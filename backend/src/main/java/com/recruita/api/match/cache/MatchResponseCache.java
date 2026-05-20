package com.recruita.api.match.cache;

import com.recruita.api.config.properties.MatchCacheKeyProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchRequest;
import com.recruita.api.match.evaluation.MatchEvaluationResult;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class MatchResponseCache {

  private final Map<String, MatchEvaluationResult> cache = new ConcurrentHashMap<>();
  private final StableJsonCanonicalizer canonicalizer;
  private final MatchCacheKeyProperties keyFields;
  private final boolean enabled;

  public MatchResponseCache(RecruitaProperties properties, StableJsonCanonicalizer canonicalizer) {
    this.enabled = properties.getMatch().getCache().isEnabled();
    this.canonicalizer = canonicalizer;
    this.keyFields = properties.getMatch().getCache().getKeyFields();
  }

  public Optional<MatchEvaluationResult> get(
      MatchRequest request, List<MatchCandidate> normalizedCandidates) {
    if (!enabled) {
      return Optional.empty();
    }
    MatchEvaluationResult cached = cache.get(cacheKey(request, normalizedCandidates));
    if (cached == null) {
      return Optional.empty();
    }
    return Optional.of(copy(cached));
  }

  public void put(
      MatchRequest request,
      List<MatchCandidate> normalizedCandidates,
      MatchEvaluationResult response) {
    if (!enabled) {
      return;
    }
    cache.put(cacheKey(request, normalizedCandidates), copy(response));
  }

  private String cacheKey(MatchRequest request, List<MatchCandidate> normalizedCandidates) {
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put(keyFields.getJobDescription(), request.jobDescription());
    payload.put(keyFields.getCandidates(), normalizedCandidates);
    payload.put(keyFields.getModel(), request.model());
    payload.put(keyFields.getTemperature(), request.temperature());
    payload.put(keyFields.getTopP(), request.topP());
    payload.put(keyFields.getSeed(), request.seed());
    payload.put(keyFields.getDeterministic(), request.deterministic());
    return canonicalizer.canonicalize(payload);
  }

  private static MatchEvaluationResult copy(MatchEvaluationResult result) {
    return switch (result) {
      case MatchEvaluationResult.Deterministic deterministic -> deterministic;
      case MatchEvaluationResult.Groq groq ->
          new MatchEvaluationResult.Groq(groq.value().deepCopy());
    };
  }
}
