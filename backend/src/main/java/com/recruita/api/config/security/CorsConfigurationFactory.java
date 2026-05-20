package com.recruita.api.config.security;

import com.recruita.api.config.properties.RecruitaProperties;
import com.recruita.api.config.properties.SecurityProperties;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfigurationFactory {

  private final SecurityProperties.CorsProperties cors;

  public CorsConfigurationFactory(RecruitaProperties properties) {
    this.cors = properties.getSecurity().getCors();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    if (cors.allowsWildcard()) {
      configuration.setAllowedOriginPatterns(List.of(cors.getWildcardOrigin()));
    } else {
      configuration.setAllowedOrigins(cors.allowedOriginsList());
    }
    configuration.setAllowedMethods(cors.allowedMethodsList());
    configuration.setAllowedHeaders(cors.allowedHeadersList());
    configuration.setMaxAge(cors.getMaxAgeSeconds());
    configuration.setAllowCredentials(cors.isAllowCredentials());

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration(cors.getRegistrationPath(), configuration);
    return source;
  }
}
