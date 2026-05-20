package com.recruita.api.match.cache;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.recruita.api.config.properties.RecruitaProperties;
import java.util.Iterator;
import java.util.SortedMap;
import java.util.TreeMap;
import org.springframework.stereotype.Component;

@Component
public class StableJsonCanonicalizer {

  private final ObjectMapper objectMapper;
  private final String nullCanonicalLiteral;

  public StableJsonCanonicalizer(RecruitaProperties properties, ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    this.nullCanonicalLiteral = properties.getMatch().getCache().getNullCanonicalLiteral();
  }

  public String canonicalize(Object value) {
    return stringify(objectMapper.valueToTree(value));
  }

  private String stringify(JsonNode node) {
    if (node == null || node.isNull()) {
      return nullCanonicalLiteral;
    }
    if (node.isArray()) {
      StringBuilder builder = new StringBuilder("[");
      ArrayNode arrayNode = (ArrayNode) node;
      for (int index = 0; index < arrayNode.size(); index++) {
        if (index > 0) {
          builder.append(',');
        }
        builder.append(stringify(arrayNode.get(index)));
      }
      builder.append(']');
      return builder.toString();
    }
    if (node.isObject()) {
      SortedMap<String, JsonNode> sorted = new TreeMap<>();
      Iterator<String> fieldNames = node.fieldNames();
      while (fieldNames.hasNext()) {
        String fieldName = fieldNames.next();
        sorted.put(fieldName, node.get(fieldName));
      }
      StringBuilder builder = new StringBuilder("{");
      boolean first = true;
      for (var entry : sorted.entrySet()) {
        if (!first) {
          builder.append(',');
        }
        first = false;
        builder
            .append(objectMapper.valueToTree(entry.getKey()).toString())
            .append(':')
            .append(stringify(entry.getValue()));
      }
      builder.append('}');
      return builder.toString();
    }
    if (node.isTextual()) {
      return objectMapper.valueToTree(node.asText()).toString();
    }
    if (node.isNumber() || node.isBoolean()) {
      return node.toString();
    }
    return node.toString();
  }

  public ObjectNode createObjectNode() {
    return objectMapper.createObjectNode();
  }
}
