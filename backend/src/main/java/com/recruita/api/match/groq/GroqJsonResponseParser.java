package com.recruita.api.match.groq;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.config.properties.RecruitaProperties;
import org.springframework.stereotype.Component;

@Component
public class GroqJsonResponseParser {

  private final ObjectMapper objectMapper;
  private final String emptyObjectLiteral;

  public GroqJsonResponseParser(RecruitaProperties properties, ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    this.emptyObjectLiteral = properties.getMatch().getGroq().getEmptyJsonObjectLiteral();
  }

  public JsonNode parse(String rawContent) {
    if (rawContent == null || rawContent.isBlank()) {
      return parseLiteral(emptyObjectLiteral);
    }
    try {
      return objectMapper.readTree(rawContent);
    } catch (Exception ex) {
      return parseLiteral(emptyObjectLiteral);
    }
  }

  private JsonNode parseLiteral(String literal) {
    try {
      return objectMapper.readTree(literal);
    } catch (Exception ex) {
      return objectMapper.createObjectNode();
    }
  }
}
