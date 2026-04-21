import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { FullState } from '../../../models/full-state.model';
import { setFilterBySkill } from '../state/applicants.actions';
import { selectFilterBySkill } from '../state/applicants.selectors';

/**
 * Toggles the skill filter: if the given skill is already active, clears it;
 * otherwise sets it as the active filter.
 */
export function toggleSkillFilter(
  store: Store<FullState>,
  skill: string
): void {
  store
    .select(selectFilterBySkill)
    .pipe(take(1))
    .subscribe((current): void => {
      store.dispatch(
        setFilterBySkill({ skill: current === skill ? null : skill })
      );
    });
}
