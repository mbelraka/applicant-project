import { RootState } from '../../../containers/root/models/root-state.model';

export interface ExportState extends RootState {
  export: {
    loading: boolean;
    error: string | null;
  };
}
