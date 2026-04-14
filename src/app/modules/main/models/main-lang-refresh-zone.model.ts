/** Registry: add a key here and one `[appMainLangRefreshHost]` host in the template. */
export const MAIN_LANG_REFRESH_ZONE = {
  HEADING: 'heading',
  OVERLAY: 'overlay',
} as const;

export type MainLangRefreshZone =
  (typeof MAIN_LANG_REFRESH_ZONE)[keyof typeof MAIN_LANG_REFRESH_ZONE];

/** Stable iteration order for reflow + bulk flag updates. */
export const MAIN_LANG_REFRESH_ZONE_IDS = Object.values(
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
