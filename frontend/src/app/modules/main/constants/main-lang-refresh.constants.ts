/** Registry: add a key here and one `[appMainLangRefreshHost]` host in the template. */
export const MAIN_LANG_REFRESH_ZONE = {
  HEADING: 'heading',
  OVERLAY: 'overlay',
} as const;

/**
 * `@keyframes` name — keep identical to `@keyframes …` in `main.component.scss`
 * (`animation:` on `.main-copy--lang-refresh`).
 */
export const MAIN_COPY_LANG_REFRESH_KEYFRAME_NAME =
  'main-copy-lang-refresh' as const;
