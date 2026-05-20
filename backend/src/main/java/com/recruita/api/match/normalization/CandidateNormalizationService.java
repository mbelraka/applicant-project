package com.recruita.api.match.normalization;

import com.recruita.api.match.domain.MatchCandidate;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CandidateNormalizationService {

  public List<MatchCandidate> normalize(List<MatchCandidate> candidates) {
    return candidates.stream()
        .map(
            candidate ->
                new MatchCandidate(
                    candidate.correlationId(),
                    candidate.skills().stream().map(String::valueOf).sorted().toList(),
                    candidate.yearsOfExperience(),
                    candidate.currentJobTitle()))
        .sorted(
            Comparator.comparing(MatchCandidate::correlationId)
                .thenComparing(
                    candidate ->
                        candidate.currentJobTitle() == null ? "" : candidate.currentJobTitle()))
        .toList();
  }
}
