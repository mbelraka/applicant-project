package com.recruita.api.observability.aop;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.recruita.api.api.controller.HealthController;
import com.recruita.api.config.properties.RecruitaProperties;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.RequestMapping;

class SecureApiAuditAspectTest {

  private final SecureApiAuditAspect aspect = new SecureApiAuditAspect(new RecruitaProperties());

  @Test
  void auditsControllerSuccessAndFailurePaths() {
    JoinPoint joinPoint = mock(JoinPoint.class);
    Signature signature = mock(Signature.class);
    when(joinPoint.getTarget()).thenReturn(new HealthController());
    when(joinPoint.getSignature()).thenReturn(signature);
    when(signature.getName()).thenReturn("health");

    aspect.auditSuccess(joinPoint);
    aspect.auditFailure(joinPoint, new IllegalStateException("boom"));
    aspect.auditFailure(joinPoint, null);
  }

  @Test
  void usesRequestMappingPrefixWhenPresent() {
    JoinPoint joinPoint = mock(JoinPoint.class);
    Signature signature = mock(Signature.class);
    @RequestMapping("/prefixed")
    class PrefixedController {}

    when(joinPoint.getTarget()).thenReturn(new PrefixedController());
    when(joinPoint.getSignature()).thenReturn(signature);
    when(signature.getName()).thenReturn("handler");

    aspect.auditSuccess(joinPoint);
  }
}
