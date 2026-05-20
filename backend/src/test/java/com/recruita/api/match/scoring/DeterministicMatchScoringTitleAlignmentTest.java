package com.recruita.api.match.scoring;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchScore;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DeterministicMatchScoringTitleAlignmentTest {

  @Autowired private DeterministicMatchScoringStrategy strategy;

  @Test
  void partialTitleOverlapProducesModerateRecommendation() {
    List<MatchScore> scores =
        strategy.score(
            "platform engineer with observability",
            List.of(new MatchCandidate("a", List.of("observability"), 3.0, "Site Reliability")));

    MatchScore score = scores.getFirst();
    assertTrue(score.recommendation().contains("Role alignment:"));
    assertTrue(score.recommendation().contains("Overall assessment:"));
  }

  @Test
  void limitedFitUsesLimitedVerdict() {
    List<MatchScore> scores =
        strategy.score(
            "quantum physicist with 20+ years",
            List.of(new MatchCandidate("a", List.of("excel"), 1.0, "Intern")));

    assertTrue(scores.getFirst().recommendation().contains("limited fit"));
  }
}
