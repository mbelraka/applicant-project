package com.recruita.api.match.groq;

public record GroqChatCompletionRequest(
    String model,
    double temperature,
    double topP,
    int seed,
    String systemPrompt,
    String userPrompt) {}
