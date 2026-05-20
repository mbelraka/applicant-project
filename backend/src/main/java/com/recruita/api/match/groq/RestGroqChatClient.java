package com.recruita.api.match.groq;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.common.exception.MatchServiceUnavailableException;
import com.recruita.api.config.properties.GroqApiContractProperties;
import com.recruita.api.config.properties.MatchProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class RestGroqChatClient implements GroqChatClient {

  private final RestClient restClient;
  private final RecruitaProperties recruitaProperties;
  private final ObjectMapper objectMapper;
  private final GroqApiContractProperties apiContract;

  public RestGroqChatClient(RecruitaProperties recruitaProperties, ObjectMapper objectMapper) {
    this.recruitaProperties = recruitaProperties;
    this.objectMapper = objectMapper;
    MatchProperties.GroqProperties groq = recruitaProperties.getMatch().getGroq();
    this.apiContract = groq.getApiContract();
    this.restClient = buildRestClient(groq);
  }

  static RestClient buildRestClient(MatchProperties.GroqProperties groq) {
    GroqApiContractProperties contract = groq.getApiContract();
    return RestClient.builder()
        .baseUrl(groq.getBaseUrl())
        .defaultHeader(
            HttpHeaders.AUTHORIZATION, contract.authorizationHeaderValue(groq.getApiKey()))
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
  }

  @Override
  public String complete(GroqChatCompletionRequest request) {
    var groq = recruitaProperties.getMatch().getGroq();
    if (groq.getApiKey().isBlank()) {
      throw new MatchServiceUnavailableException(
          recruitaProperties.getMatch().getMessages().getGroqUnavailable(),
          recruitaProperties.getRuntime().shouldSuppressErrorDetail());
    }

    GroqChatCompletionPayload body =
        GroqChatCompletionPayload.from(
            request, groq.getResponseFormatType(), apiContract.getMessageRoles());

    byte[] responseBytes =
        restClient
            .post()
            .uri(groq.getChatCompletionsPath())
            .body(body)
            .retrieve()
            .onStatus(
                status -> status.is4xxClientError() || status.is5xxServerError(),
                (httpRequest, httpResponse) -> {
                  throw new MatchServiceUnavailableException(
                      readErrorBody(httpResponse),
                      recruitaProperties.getRuntime().shouldSuppressErrorDetail());
                })
            .body(byte[].class);

    return extractContent(responseBytes, groq.getEmptyJsonObjectLiteral());
  }

  private String extractContent(byte[] responseBytes, String emptyObjectLiteral) {
    if (responseBytes == null || responseBytes.length == 0) {
      return emptyObjectLiteral;
    }
    try {
      JsonNode root = objectMapper.readTree(responseBytes);
      GroqApiContractProperties.ResponseJsonPathProperties paths =
          apiContract.getResponseJsonPaths();
      JsonNode content =
          root.path(paths.getChoices())
              .path(paths.getFirstChoiceIndex())
              .path(paths.getMessage())
              .path(paths.getContent());
      if (!content.isTextual() || content.asText().isBlank()) {
        return emptyObjectLiteral;
      }
      return content.asText();
    } catch (Exception ex) {
      return emptyObjectLiteral;
    }
  }

  private String readErrorBody(ClientHttpResponse response) {
    String fallback = recruitaProperties.getMatch().getMessages().getGroqFailed();
    try {
      byte[] bytes = response.getBody().readAllBytes();
      if (bytes.length == 0) {
        return fallback;
      }
      return new String(bytes, StandardCharsets.UTF_8);
    } catch (Exception ex) {
      return fallback;
    }
  }
}
