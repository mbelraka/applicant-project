package com.recruita.api.match.groq;

public interface GroqChatClient {

  String complete(GroqChatCompletionRequest request);
}
