import { Injectable } from '@angular/core';

/**
 * JSON read/write for browser `localStorage` (same-origin; not a secret store—XSS can read it).
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  public setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      console.error(`LocalStorageService: invalid JSON for key "${key}"`);
      return null;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
