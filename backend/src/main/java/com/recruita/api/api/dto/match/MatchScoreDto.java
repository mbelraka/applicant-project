package com.recruita.api.api.dto.match;

import java.util.List;

public record MatchScoreDto(
    String id,
    int matchScore,
    List<String> matchingSkills,
    List<String> missingSkills,
    CandidateProfileDto candidateProfile,
    String recommendation) {

  public MatchScoreDto {
    matchingSkills = List.copyOf(matchingSkills);
    missingSkills = List.copyOf(missingSkills);
  }

  public record CandidateProfileDto(
      List<String> skills, double yearsExperience, List<String> topJobTitles, String education) {

    public CandidateProfileDto {
      skills = List.copyOf(skills);
      topJobTitles = List.copyOf(topJobTitles);
    }
  }
}
