package com.recruita.api.config.properties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OperationalProperties {

  @NotNull private StartupProperties startup = new StartupProperties();
  @NotNull private ObservabilityProperties observability = new ObservabilityProperties();
  @NotNull private StrategyProperties strategy = new StrategyProperties();

  public StartupProperties getStartup() {
    return startup;
  }

  public void setStartup(StartupProperties startup) {
    this.startup = startup;
  }

  public ObservabilityProperties getObservability() {
    return observability;
  }

  public void setObservability(ObservabilityProperties observability) {
    this.observability = observability;
  }

  public StrategyProperties getStrategy() {
    return strategy;
  }

  public void setStrategy(StrategyProperties strategy) {
    this.strategy = strategy;
  }

  public static class StartupProperties {
    @NotBlank private String missingGroqApiKey = "Missing GROQ_API_KEY in environment.";

    @NotBlank
    private String productionCorsWildcardForbidden =
        "Refusing to start: CORS_ORIGIN=* is not allowed when NODE_ENV=production.";

    public String getMissingGroqApiKey() {
      return missingGroqApiKey;
    }

    public void setMissingGroqApiKey(String missingGroqApiKey) {
      this.missingGroqApiKey = missingGroqApiKey;
    }

    public String getProductionCorsWildcardForbidden() {
      return productionCorsWildcardForbidden;
    }

    public void setProductionCorsWildcardForbidden(String productionCorsWildcardForbidden) {
      this.productionCorsWildcardForbidden = productionCorsWildcardForbidden;
    }
  }

  public static class ObservabilityProperties {
    @NotBlank private String unknownErrorType = "unknown";
    @NotBlank private String auditSuccessTemplate = "api.success handler={}";
    @NotBlank private String auditFailureTemplate = "api.failure handler={} errorType={}";

    @NotBlank
    private String matchEvaluateCompletedTemplate =
        "match.evaluate completed deterministic={} candidates={} scores={} durationMs={}";

    @NotBlank
    private String matchEvaluateRejectedTemplate =
        "match.evaluate rejected deterministic={} candidates={} durationMs={}";

    @NotBlank
    private String matchEvaluateFailedTemplate =
        "match.evaluate failed deterministic={} candidates={} durationMs={}";

    public String getUnknownErrorType() {
      return unknownErrorType;
    }

    public void setUnknownErrorType(String unknownErrorType) {
      this.unknownErrorType = unknownErrorType;
    }

    public String getAuditSuccessTemplate() {
      return auditSuccessTemplate;
    }

    public void setAuditSuccessTemplate(String auditSuccessTemplate) {
      this.auditSuccessTemplate = auditSuccessTemplate;
    }

    public String getAuditFailureTemplate() {
      return auditFailureTemplate;
    }

    public void setAuditFailureTemplate(String auditFailureTemplate) {
      this.auditFailureTemplate = auditFailureTemplate;
    }

    public String getMatchEvaluateCompletedTemplate() {
      return matchEvaluateCompletedTemplate;
    }

    public void setMatchEvaluateCompletedTemplate(String matchEvaluateCompletedTemplate) {
      this.matchEvaluateCompletedTemplate = matchEvaluateCompletedTemplate;
    }

    public String getMatchEvaluateRejectedTemplate() {
      return matchEvaluateRejectedTemplate;
    }

    public void setMatchEvaluateRejectedTemplate(String matchEvaluateRejectedTemplate) {
      this.matchEvaluateRejectedTemplate = matchEvaluateRejectedTemplate;
    }

    public String getMatchEvaluateFailedTemplate() {
      return matchEvaluateFailedTemplate;
    }

    public void setMatchEvaluateFailedTemplate(String matchEvaluateFailedTemplate) {
      this.matchEvaluateFailedTemplate = matchEvaluateFailedTemplate;
    }
  }

  public static class StrategyProperties {
    @NotBlank private String noMatchEvaluationStrategy = "No match evaluation strategy registered";

    @NotBlank private String noMatchScoringStrategy = "No match scoring strategy registered";

    @NotBlank
    private String groqPromptSerializationFailed = "Failed to serialize candidates for Groq prompt";

    public String getNoMatchEvaluationStrategy() {
      return noMatchEvaluationStrategy;
    }

    public void setNoMatchEvaluationStrategy(String noMatchEvaluationStrategy) {
      this.noMatchEvaluationStrategy = noMatchEvaluationStrategy;
    }

    public String getNoMatchScoringStrategy() {
      return noMatchScoringStrategy;
    }

    public void setNoMatchScoringStrategy(String noMatchScoringStrategy) {
      this.noMatchScoringStrategy = noMatchScoringStrategy;
    }

    public String getGroqPromptSerializationFailed() {
      return groqPromptSerializationFailed;
    }

    public void setGroqPromptSerializationFailed(String groqPromptSerializationFailed) {
      this.groqPromptSerializationFailed = groqPromptSerializationFailed;
    }
  }
}
