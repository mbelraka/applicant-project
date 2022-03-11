import {Action, ActionReducer, createReducer, INIT, on, UPDATE} from '@ngrx/store';
import { ObjectMapper } from 'json-object-mapper';
import * as _ from 'lodash';
import { Applicant } from 'src/app/modules/applicants/models/applicant.model';
import { deleteApplicant, newApplicant } from 'src/app/state/state.actions';

export const applicantsState: Applicant[] = [];

export const stateReducer = createReducer(
  applicantsState,
  on(
    newApplicant,
    (applicants: Applicant[], newApplicant: Applicant): Applicant[] => {
      const updatedState = _.clone(applicants);
      updatedState.push(ObjectMapper.deserialize(Applicant, newApplicant));
      return updatedState;
    }
  ),
  on(
    deleteApplicant,
    (applicants: Applicant[], applicant: Applicant): Applicant[] => {
      const updatedState = _.clone(applicants);
      const applicantIndex = updatedState.findIndex(
        (_applicant) =>
          _applicant.firstName === applicant.firstName &&
          _applicant.lastName === applicant.lastName
      );

      if (applicantIndex >= 0) {
        updatedState.splice(applicantIndex, 1);
      }

      return updatedState;
    }
  )
);

export const metaReducerLocalStorage = (
  reducer: ActionReducer<any>
): ActionReducer<any> => {
  return (state, action: Action) => {
    if (action.type === INIT || action.type == UPDATE) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return  JSON.parse(storageValue).map(element => ObjectMapper.deserialize(Applicant, element));
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));
    return nextState;
  };
};
