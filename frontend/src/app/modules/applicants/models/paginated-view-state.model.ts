import { Signal, WritableSignal } from '@angular/core';

export interface PaginatedViewState<T> {
  readonly pageIndex: WritableSignal<number>;
  readonly pageCount: Signal<number>;
  readonly pageNumbers: Signal<number[]>;
  readonly pagedItems: Signal<T[]>;
  goToPage(index: number): void;
}
