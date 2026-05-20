package com.recruita.api.common.exception;

public class MatchServiceUnavailableException extends RuntimeException {

  private final boolean suppressDetail;

  public MatchServiceUnavailableException(String message, boolean suppressDetail) {
    super(message);
    this.suppressDetail = suppressDetail;
  }

  public boolean suppressDetail() {
    return suppressDetail;
  }
}
