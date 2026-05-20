package com.recruita.api.match.scoring;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.recruita.api.match.domain.MatchCandidate;
import com.recruita.api.match.domain.MatchScore;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DeterministicMatchScoringStrategyTest {

  @Autowired private DeterministicMatchScoringStrategy strategy;

  @Test
  void supportsDeterministicModeOnly() {
    assertTrue(strategy.supports(true));
    assertFalse(strategy.supports(false));
  }

  @Test
  void scoresCandidateAgainstJobDescription() {
    String job = "Senior engineer with 5+ years and angular typescript";
    List<MatchCandidate> candidates =
        List.of(new MatchCandidate("c1", List.of("angular", "typescript"), 6.0, "Senior Engineer"));

    List<MatchScore> scores = strategy.score(job, candidates);

    assertFalse(scores.isEmpty());
    assertTrue(scores.getFirst().matchScore() >= 0);
    assertTrue(scores.getFirst().matchScore() <= 100);
  }
}
