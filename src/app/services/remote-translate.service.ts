import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  tap,
  timeout,
} from 'rxjs';

import { APP_CONFIG } from '../config/app.config';
import { Languages } from '../enums/language.enum';
import { MyMemoryResponse } from '../models/mymemory-translate-response.model';

/**
 * MyMemory’s public `get` API for short strings. Results are cached in memory;
 * parallel identical requests are deduplicated.
 */
@Injectable({ providedIn: 'root' })
export class RemoteTranslateService {
  private readonly _cache = new Map<string, string>();
  private readonly _inFlight = new Map<string, Observable<string>>();

  public constructor(private readonly _http: HttpClient) {}

  /**
   * Synchronous read of a completed translation (see {@link translate}).
   * The UI can use this to avoid showing a fallback before the first HTTP response.
   */
  public getCached(
    text: string | null | undefined,
    from: Languages,
    to: Languages
  ): string | undefined {
    const raw = this._normalizeText(text);
    if (raw === null) {
      return undefined;
    }
    if (from === to) {
      return raw;
    }
    return this._cache.get(this._cacheKey(from, to, raw));
  }

  /**
   * Key used for {@link getCached} / `translate` caches, or `null` if `text` is empty.
   * Exposed for consumers that memoize on the same key (e.g. the `remoteTranslate` pipe).
   */
  public lookupKey(
    text: string | null | undefined,
    from: Languages,
    to: Languages
  ): string | null {
    const raw = this._normalizeText(text);
    if (raw === null) {
      return null;
    }
    return this._cacheKey(from, to, raw);
  }

  public translate(
    text: string | null | undefined,
    from: Languages,
    to: Languages
  ): Observable<string> {
    const raw = this._normalizeText(text);
    if (raw === null) {
      return of('');
    }
    if (from === to) {
      return of(raw);
    }

    const key = this._cacheKey(from, to, raw);
    const fromCache = this._cache.get(key);
    if (fromCache !== undefined) {
      return of(fromCache);
    }

    const inFlight = this._inFlight.get(key);
    if (inFlight) {
      return inFlight;
    }

    const request$ = this._requestTranslation$(raw, from, to, key);
    this._inFlight.set(key, request$);
    return request$;
  }

  private _requestTranslation$(
    raw: string,
    from: Languages,
    to: Languages,
    cacheKey: string
  ): Observable<string> {
    const { MYMEMORY_URL, REQUEST_TIMEOUT_MS } = APP_CONFIG.TRANSLATION;
    const params = new HttpParams()
      .set('q', raw)
      .set('langpair', `${from}|${to}`);

    return this._http.get<MyMemoryResponse>(MYMEMORY_URL, { params }).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      map((res) => (res?.responseData?.translatedText?.trim() ?? '') || raw),
      tap((translated) => {
        this._cache.set(cacheKey, translated);
      }),
      catchError(() => of(raw)),
      finalize(() => {
        this._inFlight.delete(cacheKey);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private _normalizeText(text: string | null | undefined): string | null {
    const trimmed = text?.trim() ?? '';
    return trimmed ? trimmed : null;
  }

  private _cacheKey(from: Languages, to: Languages, raw: string): string {
    return `${from}|${to}|${raw}`;
  }
}
