package com.recruita.api.observability.aop;

import com.recruita.api.config.properties.OperationalProperties;
import com.recruita.api.config.properties.RecruitaProperties;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

@Aspect
@Component
public class SecureApiAuditAspect {

  private static final Logger LOG = LoggerFactory.getLogger(SecureApiAuditAspect.class);

  private final OperationalProperties.ObservabilityProperties observability;

  public SecureApiAuditAspect(RecruitaProperties properties) {
    this.observability = properties.getOperational().getObservability();
  }

  @AfterReturning(
      pointcut =
          "@within(org.springframework.web.bind.annotation.RestController) "
              + "&& execution(* com.recruita.api.api.controller..*(..))")
  public void auditSuccess(JoinPoint joinPoint) {
    LOG.debug(observability.getAuditSuccessTemplate(), handlerName(joinPoint));
  }

  @AfterThrowing(
      pointcut =
          "@within(org.springframework.web.bind.annotation.RestController) "
              + "&& execution(* com.recruita.api.api.controller..*(..))",
      throwing = "error")
  public void auditFailure(JoinPoint joinPoint, Throwable error) {
    LOG.debug(
        observability.getAuditFailureTemplate(),
        handlerName(joinPoint),
        error == null ? observability.getUnknownErrorType() : error.getClass().getSimpleName());
  }

  private static String handlerName(JoinPoint joinPoint) {
    RequestMapping mapping = joinPoint.getTarget().getClass().getAnnotation(RequestMapping.class);
    String base = mapping == null || mapping.value().length == 0 ? "" : mapping.value()[0];
    return joinPoint.getSignature().getName() + base;
  }
}
