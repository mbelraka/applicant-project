import { MAIN_LANG_REFRESH_ZONE } from '../constants/main-lang-refresh.constants';

export type MainLangRefreshZone =
  (typeof MAIN_LANG_REFRESH_ZONE)[keyof typeof MAIN_LANG_REFRESH_ZONE];
