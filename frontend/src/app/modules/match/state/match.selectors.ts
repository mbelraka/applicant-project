import { createFeatureSelector, createSelector } from '@ngrx/store';

import { APP_CONFIG } from '../../../config/app.config';
import { StateFeatures } from '../../../containers/root/enums/state-features.enum';
import { selectAllApplicants } from '../../applicants/state/applicants.selectors';
import { MatchFeatureState } from '../models/match-state.model';

const selectMatchState = createFeatureSelector<MatchFeatureState>(
  StateFeatures.Match
);

const initialMatchState: MatchFeatureState = {
  loading: false,
  error: null,
  jobDescription: '',
  topCandidatesCount: APP_CONFIG.MATCH.TOP_CANDIDATES_COUNT,
  results: [],
};

export const selectMatchLoading = createSelector(
  selectMatchState,
  (state): boolean => (state ?? initialMatchState).loading
);

export const selectMatchError = createSelector(
  selectMatchState,
  (state): string | null => (state ?? initialMatchState).error
);

export const selectMatchJobDescription = createSelector(
  selectMatchState,
  (state): string => (state ?? initialMatchState).jobDescription
);

export const selectTopCandidatesCount = createSelector(
  selectMatchState,
  (state): number => (state ?? initialMatchState).topCandidatesCount
);

export const selectMatchResults = createSelector(
  selectMatchState,
  (state) => (state ?? initialMatchState).results
);

export const selectTopMatchResults = createSelector(
  selectMatchResults,
  (results) => results.filter((candidate) => candidate.isTopCandidate)
);

export const selectEvaluatedCandidatesCount = createSelector(
  selectMatchResults,
  (results): number => results.length
);

export const selectRegisteredApplicantsCount = createSelector(
  selectAllApplicants,
  (applicants): number => applicants.length
);
