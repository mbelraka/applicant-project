import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { toggleSkillFilter } from './toggle-skill-filter.util';
import * as Selectors from '../state/applicants.selectors';
import * as Actions from '../state/applicants.actions';

describe('toggleSkillFilter', () => {
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  });

  it('should set the skill when no skill is currently active', () => {
    mockStore.select.and.callFake((selector: any) => {
      if (selector === Selectors.selectFilterBySkill) return of(null);
      return of(null);
    });

    toggleSkillFilter(mockStore as any, 'Angular');

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      Actions.setFilterBySkill({ skill: 'Angular' })
    );
  });

  it('should clear the skill when it is already active (toggle off)', () => {
    mockStore.select.and.callFake((selector: any) => {
      if (selector === Selectors.selectFilterBySkill) return of('Angular');
      return of(null);
    });

    toggleSkillFilter(mockStore as any, 'Angular');

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      Actions.setFilterBySkill({ skill: null })
    );
  });

  it('should switch to the new skill when a different skill is active', () => {
    mockStore.select.and.callFake((selector: any) => {
      if (selector === Selectors.selectFilterBySkill) return of('React');
      return of(null);
    });

    toggleSkillFilter(mockStore as any, 'Angular');

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      Actions.setFilterBySkill({ skill: 'Angular' })
    );
  });
});
