import { StateFeatures } from '../../../containers/root/enums/state-features.enum';
import { selectExportLoading } from './export.selectors';

describe('export selectors', () => {
  it('selects loading state when export feature exists', () => {
    const state = {
      [StateFeatures.Export]: {
        loading: true,
        error: null,
      },
    } as never;

    expect(selectExportLoading(state)).toBeTrue();
  });

  it('falls back to non-loading state when export feature is missing', () => {
    const state = {} as never;

    expect(selectExportLoading(state)).toBeFalse();
  });
});
