package com.recruita.api.match.groq;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withBadRequest;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruita.api.common.exception.MatchServiceUnavailableException;
import com.recruita.api.config.properties.RecruitaProperties;
import java.lang.reflect.Field;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class RestGroqChatClientHttpTest {

  @Test
  void returnsContentFromSuccessfulGroqResponse() throws Exception {
    RecruitaProperties properties = groqProperties("test-key", "http://localhost");
    RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost");
    MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
    RestGroqChatClient client = clientWithRestClient(properties, builder.build());

    server
        .expect(requestTo("http://localhost/chat/completions"))
        .andExpect(method(HttpMethod.POST))
        .andRespond(
            withSuccess(
                """
                {"choices":[{"message":{"content":"{\\"scores\\":[]}"}}]}
                """,
                MediaType.APPLICATION_JSON));

    String content =
        client.complete(new GroqChatCompletionRequest("model", 0, 1, 42, "system", "user"));

    assertEquals("{\"scores\":[]}", content);
    server.verify();
  }

  @Test
  void returnsEmptyLiteralForMissingContent() throws Exception {
    RecruitaProperties properties = groqProperties("test-key", "http://localhost");
    RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost");
    MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
    RestGroqChatClient client = clientWithRestClient(properties, builder.build());

    server
        .expect(requestTo("http://localhost/chat/completions"))
        .andRespond(withSuccess("{\"choices\":[{\"message\":{}}]}", MediaType.APPLICATION_JSON));

    String content =
        client.complete(new GroqChatCompletionRequest("model", 0, 1, 42, "system", "user"));

    assertEquals("{}", content);
    server.verify();
  }

  @Test
  void returnsEmptyLiteralForInvalidJsonOrBlankContent() throws Exception {
    RecruitaProperties properties = groqProperties("test-key", "http://localhost");
    RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost");
    MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
    RestGroqChatClient client = clientWithRestClient(properties, builder.build());

    server
        .expect(requestTo("http://localhost/chat/completions"))
        .andRespond(withSuccess("not-json", MediaType.APPLICATION_JSON));
    assertEquals(
        "{}", client.complete(new GroqChatCompletionRequest("model", 0, 1, 42, "system", "user")));

    server.reset();
    server
        .expect(requestTo("http://localhost/chat/completions"))
        .andRespond(
            withSuccess(
                "{\"choices\":[{\"message\":{\"content\":\"   \"}}]}", MediaType.APPLICATION_JSON));
    assertEquals(
        "{}", client.complete(new GroqChatCompletionRequest("model", 0, 1, 42, "system", "user")));
    server.verify();
  }

  @Test
  void mapsProviderErrorsToServiceUnavailable() throws Exception {
    RecruitaProperties properties = groqProperties("test-key", "http://localhost");
    RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost");
    MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
    RestGroqChatClient client = clientWithRestClient(properties, builder.build());

    server
        .expect(requestTo("http://localhost/chat/completions"))
        .andRespond(withBadRequest().body("provider rejected"));

    assertThrows(
        MatchServiceUnavailableException.class,
        () -> client.complete(new GroqChatCompletionRequest("model", 0, 1, 42, "system", "user")));
    server.verify();
  }

  private static RestGroqChatClient clientWithRestClient(
      RecruitaProperties properties, RestClient restClient) throws Exception {
    RestGroqChatClient client = new RestGroqChatClient(properties, new ObjectMapper());
    Field restClientField = RestGroqChatClient.class.getDeclaredField("restClient");
    restClientField.setAccessible(true);
    restClientField.set(client, restClient);
    return client;
  }

  private static RecruitaProperties groqProperties(String apiKey, String baseUrl) {
    RecruitaProperties properties = new RecruitaProperties();
    properties.getMatch().getGroq().setApiKey(apiKey);
    properties.getMatch().getGroq().setBaseUrl(baseUrl);
    return properties;
  }
}
