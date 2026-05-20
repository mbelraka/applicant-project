package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.config.properties.RecruitaProperties;
import org.junit.jupiter.api.Test;

class GroqJsonResponseParserTest {

  @Test
  void returnsEmptyObjectForInvalidPayloads() {
    RecruitaProperties properties = new RecruitaProperties();
    GroqJsonResponseParser parser = new GroqJsonResponseParser(properties, new ObjectMapper());

    assertTrue(parser.parse(null).isEmpty());
    assertTrue(parser.parse("").isEmpty());
    assertTrue(parser.parse("{not-json").isEmpty());
  }
}
