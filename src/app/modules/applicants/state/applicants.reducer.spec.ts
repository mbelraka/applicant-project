import { ApplicationStatus } from '../enums/application-status.enum';
import { ViewTypes } from '../enums/view-types.enum';
import { ApplicantState } from '../models/applicant-state.model';
import { Applicant } from '../models/applicant.model';
import * as ApplicantsActions from './applicants.actions';
import { adapter, applicantsReducer } from './applicants.reducer';

describe('Applicants Reducer', () => {
  let initialState: ApplicantState;

  const mockApplicant: Applicant = new Applicant({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    currentJobTitle: 'Developer',
    location: 'NY',
    yearsOfExperience: 5,
    applicationStatus: ApplicationStatus.Received,
  });

  beforeEach(() => {
    initialState = adapter.getInitialState({
      loading: false,
      error: null,
      filter: '',
      sortBy: 'name',
      sortDirection: 'asc',
      filterBySkill: null,
      filterByStatus: null,
      filterByCountry: null,
      viewType: ViewTypes.GRID,
      locationSuggestions: [],
    });
  });

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = applicantsReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('loadApplicants action', () => {
    it('should set loading to true and error to null', () => {
      const action = ApplicantsActions.loadApplicants();
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should set applicants and loading to false on success', () => {
      const action = ApplicantsActions.loadApplicantsSuccess({
        applicants: [mockApplicant],
      });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
      expect(state.entities['1']).toEqual(mockApplicant);
    });

    it('should set error on failure', () => {
      const error = 'Failed to load';
      const action = ApplicantsActions.loadApplicantsFailure({ error });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toBe(error);
    });
  });

  describe('addApplicant action', () => {
    it('should set loading to true', () => {
      const action = ApplicantsActions.addApplicant({
        applicant: mockApplicant,
      });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should update applicants and set loading to false on success', () => {
      const action = ApplicantsActions.addApplicantSuccess({
        applicants: [mockApplicant],
      });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.entities['1']).toEqual(mockApplicant);
    });

    it('should set error on failure', () => {
      const error = 'Failed to add';
      const action = ApplicantsActions.addApplicantFailure({ error });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toBe(error);
    });
  });

  describe('updateApplicant action', () => {
    it('should set loading to true', () => {
      const action = ApplicantsActions.updateApplicant({
        applicant: mockApplicant,
      });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should update applicants and set loading to false on success', () => {
      const action = ApplicantsActions.updateApplicantSuccess({
        applicants: [mockApplicant],
      });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.entities['1']).toEqual(mockApplicant);
    });

    it('should set error on failure', () => {
      const error = 'Failed to update';
      const action = ApplicantsActions.updateApplicantFailure({ error });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toBe(error);
    });
  });

  describe('deleteApplicant action', () => {
    it('should set loading to true', () => {
      const action = ApplicantsActions.deleteApplicant({ id: '1' });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should update applicants and set loading to false on success', () => {
      const action = ApplicantsActions.deleteApplicantSuccess({
        applicants: [],
      });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.entities).toEqual({});
    });

    it('should set error on failure', () => {
      const error = 'Failed to delete';
      const action = ApplicantsActions.deleteApplicantFailure({ error });
      const state = applicantsReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toBe(error);
    });
  });

  describe('filter and sort actions', () => {
    it('should set global filter', () => {
      const action = ApplicantsActions.setGlobalFilter({ filter: 'John' });
      const state = applicantsReducer(initialState, action);

      expect(state.filter).toBe('John');
    });

    it('should set sort by', () => {
      const action = ApplicantsActions.setSortBy({
        sortBy: 'name',
        sortDirection: 'desc',
      });
      const state = applicantsReducer(initialState, action);

      expect(state.sortBy).toBe('name');
      expect(state.sortDirection).toBe('desc');
    });

    it('should set sortDirection to asc if sortBy is null', () => {
      const action = ApplicantsActions.setSortBy({
        sortBy: null,
      });
      const state = applicantsReducer(initialState, action);

      expect(state.sortBy).toBeNull();
      expect(state.sortDirection).toBe('asc');
    });

    it('should use default sort direction asc if not provided', () => {
      const action = ApplicantsActions.setSortBy({
        sortBy: 'location',
      } as any); // cast because sortDirection is optional but technically sortDirection?: 'asc' | 'desc'
      const state = applicantsReducer(initialState, action);

      expect(state.sortBy).toBe('location');
      expect(state.sortDirection).toBe('asc');
    });

    it('should set view type', () => {
      const action = ApplicantsActions.setViewType({
        viewType: ViewTypes.LIST,
      });
      const state = applicantsReducer(initialState, action);

      expect(state.viewType).toBe(ViewTypes.LIST);
    });

    it('should set filter by skill', () => {
      const action = ApplicantsActions.setFilterBySkill({ skill: 'Angular' });
      const state = applicantsReducer(initialState, action);

      expect(state.filterBySkill).toBe('Angular');
    });

    it('should set filter by status', () => {
      const action = ApplicantsActions.setFilterByStatus({
        status: ApplicationStatus.Received,
      });
      const state = applicantsReducer(initialState, action);

      expect(state.filterByStatus).toBe(ApplicationStatus.Received);
    });

    it('should set filter by country', () => {
      const action = ApplicantsActions.setFilterByCountry({ country: 'USA' });
      const state = applicantsReducer(initialState, action);

      expect(state.filterByCountry).toBe('USA');
    });
  });

  describe('location suggestions actions', () => {
    it('should update location suggestions on success', () => {
      const action = ApplicantsActions.searchLocationSuggestionsSuccess({
        suggestions: ['NY', 'NJ'],
      });
      const state = applicantsReducer(initialState, action);

      expect(state.locationSuggestions).toEqual(['NY', 'NJ']);
    });

    it('should clear suggestions on failure', () => {
      const action = ApplicantsActions.searchLocationSuggestionsFailure();
      const state = applicantsReducer(initialState, action);

      expect(state.locationSuggestions).toEqual([]);
    });

    it('should clear suggestions on clear location suggestions', () => {
      const action = ApplicantsActions.clearLocationSuggestions();
      const state = applicantsReducer(initialState, action);

      expect(state.locationSuggestions).toEqual([]);
    });
  });
});
