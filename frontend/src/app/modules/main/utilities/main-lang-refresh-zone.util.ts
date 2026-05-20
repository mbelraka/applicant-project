import { MAIN_LANG_REFRESH_ZONE } from '../constants/main-lang-refresh.constants';
import type { MainLangRefreshZone } from '../models/main-lang-refresh-zone.model';

/** Stable iteration order for reflow + bulk flag updates. */
const MAIN_LANG_REFRESH_ZONE_IDS = Object.values(
  MAIN_LANG_REFRESH_ZONE
) as MainLangRefreshZone[];

export function createMainLangRefreshZoneFlags(
  value: boolean
): Record<MainLangRefreshZone, boolean> {
  return MAIN_LANG_REFRESH_ZONE_IDS.reduce(
    (acc, zone) => {
      acc[zone] = value;
      return acc;
    },
    {} as Record<MainLangRefreshZone, boolean>
  );
}
