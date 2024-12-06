import { AppState } from './app-state.model';

export interface FullState {
  app: AppState; // AppState is nested under the key `app`
}
