package com.recruita.api.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

class ArchitectureTest {

  private static final JavaClasses CLASSES =
      new ClassFileImporter().importPackages("com.recruita.api");

  @Test
  void controllers_do_not_call_scoring_or_domain_directly() {
    ArchRule rule =
        noClasses()
            .that()
            .resideInAPackage("..api.controller..")
            .should()
            .accessClassesThat()
            .resideInAnyPackage("..match.scoring..", "..match.domain..");
    rule.check(CLASSES);
  }

  @Test
  void domain_does_not_depend_on_web_or_http_dtos() {
    ArchRule rule =
        noClasses()
            .that()
            .resideInAPackage("..match.domain..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(
                "..api.controller..", "..api.dto..", "..api.advice..", "org.springframework.web..");
    rule.check(CLASSES);
  }
}
