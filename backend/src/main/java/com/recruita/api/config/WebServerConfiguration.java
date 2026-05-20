package com.recruita.api.config;

import com.recruita.api.config.properties.RecruitaProperties;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebServerConfiguration {

  @Bean
  WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatMaxPostSizeCustomizer(
      RecruitaProperties properties) {
    int maxPostSize = properties.getSecurity().getHttp().getMaxJsonBodyBytes();
    return factory ->
        factory.addConnectorCustomizers(connector -> connector.setMaxPostSize(maxPostSize));
  }
}
