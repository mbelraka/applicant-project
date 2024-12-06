import { createFeatureSelector } from '@ngrx/store';
import { RootState } from '../models/root-state.model';

// Select the entire root state
export const selectRootState = createFeatureSelector<RootState>('root');
