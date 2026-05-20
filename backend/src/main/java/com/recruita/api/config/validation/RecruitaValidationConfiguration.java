package com.recruita.api.config.validation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
public class RecruitaValidationConfiguration {

  @Bean
  LocalValidatorFactoryBean defaultValidator(RecruitaValidationMessageSource messageSource) {
    LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
    factory.setValidationMessageSource(messageSource);
    return factory;
  }
}
