package com.recruita.api.match.cache;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.config.properties.RecruitaProperties;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class StableJsonCanonicalizerTest {

  @Test
  void canonicalizesMapsWithSortedKeys() {
    StableJsonCanonicalizer canonicalizer =
        new StableJsonCanonicalizer(new RecruitaProperties(), new ObjectMapper());
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("b", 2);
    payload.put("a", List.of(1));

    String first = canonicalizer.canonicalize(payload);
    String second = canonicalizer.canonicalize(Map.of("a", List.of(1), "b", 2));

    assertEquals(first, second);
    assertEquals("{\"a\":[1],\"b\":2}", first);
  }
}
