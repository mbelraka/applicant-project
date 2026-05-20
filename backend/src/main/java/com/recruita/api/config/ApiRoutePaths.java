package com.recruita.api.config;

import com.recruita.api.config.properties.RecruitaProperties;
import org.springframework.stereotype.Component;

/** Exposes configured API paths for SpEL-based request mappings and security rules. */
@Component("apiRoutePaths")
public class ApiRoutePaths {

  private final String healthPath;
  private final String matchPath;
  private final String matchLegacyPath;

  public ApiRoutePaths(RecruitaProperties properties) {
    var routes = properties.getApi().getRoutes();
    this.healthPath = routes.getHealthPath();
    this.matchPath = routes.getMatchPath();
    this.matchLegacyPath = routes.getMatchLegacyPath();
  }

  public String getHealthPath() {
    return healthPath;
  }

  public String getMatchPath() {
    return matchPath;
  }

  public String getMatchLegacyPath() {
    return matchLegacyPath;
  }
}
