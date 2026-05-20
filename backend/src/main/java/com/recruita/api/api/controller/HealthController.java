package com.recruita.api.api.controller;

import com.recruita.api.api.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class HealthController {

  @GetMapping(path = "#{@apiRoutePaths.healthPath}")
  public HealthResponse health() {
    return new HealthResponse(true);
  }
}
