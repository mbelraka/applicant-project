package com.recruita.api.match.scoring;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchScore;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DeterministicMatchScoringStrategyBranchesTest {

  @Autowired private DeterministicMatchScoringStrategy strategy;

  @Test
  void handlesMissingYearsOfExperience() {
    List<MatchScore> scores =
        strategy.score(
            "Developer with 3+ years and java skills",
            List.of(new MatchCandidate("a", List.of("java"), null, "Developer")));

    assertTrue(scores.getFirst().matchScore() >= 0);
    assertTrue(scores.getFirst().recommendation().contains("Overall assessment:"));
  }

  @Test
  void reportsGapsWhenSkillsMissing() {
    List<MatchScore> scores =
        strategy.score(
            "python kubernetes platform engineer",
            List.of(
                new MatchCandidate("a", List.of("python"), 2.0, "Junior Dev"),
                new MatchCandidate("b", List.of("kubernetes"), 2.0, "Ops")));

    assertTrue(scores.getFirst().missingSkills().contains("kubernetes"));
  }

  @Test
  void strongMatchProducesHighScore() {
    List<MatchScore> scores =
        strategy.score(
            "Senior python engineer with 8+ years",
            List.of(new MatchCandidate("a", List.of("python"), 10.0, "Senior python engineer")));

    assertTrue(scores.getFirst().matchScore() >= 85);
  }
}
