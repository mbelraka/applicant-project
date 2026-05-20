package com.recruita.api.config.properties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Groq/OpenAI-compatible HTTP and JSON field contract (external API shape). */
public class GroqApiContractProperties {

  @NotBlank private String bearerAuthorizationPrefix = "Bearer ";
  @NotBlank private String matchResponseScoresField = "scores";
  @NotNull private MessageRoleProperties messageRoles = new MessageRoleProperties();
  @NotNull private ResponseJsonPathProperties responseJsonPaths = new ResponseJsonPathProperties();

  @NotNull
  private SamplerUnitIntervalProperties samplerUnitInterval = new SamplerUnitIntervalProperties();

  public String getBearerAuthorizationPrefix() {
    return bearerAuthorizationPrefix;
  }

  public void setBearerAuthorizationPrefix(String bearerAuthorizationPrefix) {
    this.bearerAuthorizationPrefix = bearerAuthorizationPrefix;
  }

  public String authorizationHeaderValue(String apiKey) {
    return bearerAuthorizationPrefix + apiKey;
  }

  public String getMatchResponseScoresField() {
    return matchResponseScoresField;
  }

  public void setMatchResponseScoresField(String matchResponseScoresField) {
    this.matchResponseScoresField = matchResponseScoresField;
  }

  public MessageRoleProperties getMessageRoles() {
    return messageRoles;
  }

  public void setMessageRoles(MessageRoleProperties messageRoles) {
    this.messageRoles = messageRoles;
  }

  public ResponseJsonPathProperties getResponseJsonPaths() {
    return responseJsonPaths;
  }

  public void setResponseJsonPaths(ResponseJsonPathProperties responseJsonPaths) {
    this.responseJsonPaths = responseJsonPaths;
  }

  public SamplerUnitIntervalProperties getSamplerUnitInterval() {
    return samplerUnitInterval;
  }

  public void setSamplerUnitInterval(SamplerUnitIntervalProperties samplerUnitInterval) {
    this.samplerUnitInterval = samplerUnitInterval;
  }

  public static class MessageRoleProperties {
    @NotBlank private String system = "system";
    @NotBlank private String user = "user";

    public String getSystem() {
      return system;
    }

    public void setSystem(String system) {
      this.system = system;
    }

    public String getUser() {
      return user;
    }

    public void setUser(String user) {
      this.user = user;
    }
  }

  public static class ResponseJsonPathProperties {
    @NotBlank private String choices = "choices";
    @NotBlank private String message = "message";
    @NotBlank private String content = "content";
    private int firstChoiceIndex = 0;

    public String getChoices() {
      return choices;
    }

    public void setChoices(String choices) {
      this.choices = choices;
    }

    public String getMessage() {
      return message;
    }

    public void setMessage(String message) {
      this.message = message;
    }

    public String getContent() {
      return content;
    }

    public void setContent(String content) {
      this.content = content;
    }

    public int getFirstChoiceIndex() {
      return firstChoiceIndex;
    }

    public void setFirstChoiceIndex(int firstChoiceIndex) {
      this.firstChoiceIndex = firstChoiceIndex;
    }
  }

  public static class SamplerUnitIntervalProperties {
    private double min = 0;
    private double max = 1;

    public double getMin() {
      return min;
    }

    public void setMin(double min) {
      this.min = min;
    }

    public double getMax() {
      return max;
    }

    public void setMax(double max) {
      this.max = max;
    }
  }
}
