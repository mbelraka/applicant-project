import {
  computed,
  effect,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

export interface PaginatedViewState<T> {
  readonly pageIndex: WritableSignal<number>;
  readonly pageCount: Signal<number>;
  readonly pageNumbers: Signal<number[]>;
  readonly pagedItems: Signal<T[]>;
  goToPage(index: number): void;
}

export function createPaginatedViewState<T>(
  items: Signal<T[]>,
  pageSize: Signal<number>
): PaginatedViewState<T> {
  const pageIndex = signal(0);

  const pageCount = computed(() => {
    const list = items();
    const size = Math.max(1, pageSize());
    return Math.max(1, Math.ceil(list.length / size));
  });

  const pageNumbers = computed(() =>
    Array.from({ length: pageCount() }, (_, i) => i + 1)
  );

  const pagedItems = computed(() => {
    const list = items();
    const size = Math.max(1, pageSize());
    const start = pageIndex() * size;
    return list.slice(start, start + size);
  });

  const goToPage = (index: number): void => {
    const max = pageCount() - 1;
    if (index >= 0 && index <= max) {
      pageIndex.set(index);
    }
  };

  effect(() => {
    const maxIdx = pageCount() - 1;
    if (pageIndex() > maxIdx) {
      pageIndex.set(Math.max(0, maxIdx));
    }
  });

  return {
    pageIndex,
    pageCount,
    pageNumbers,
    pagedItems,
    goToPage,
  };
}
