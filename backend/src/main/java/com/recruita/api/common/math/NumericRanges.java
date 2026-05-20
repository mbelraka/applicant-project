package com.recruita.api.common.math;

public final class NumericRanges {

  private NumericRanges() {}

  public static double clamp(double value, double min, double max) {
    return Math.max(min, Math.min(max, value));
  }
}
