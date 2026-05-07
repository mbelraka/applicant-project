import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Placeholder for bearer tokens, `withCredentials`, and `401` handling.
 * Prefer same-origin APIs and short-lived cookies over shipping long-lived secrets to the browser bundle.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req);
  }
}
