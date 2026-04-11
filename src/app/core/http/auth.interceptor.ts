import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Central hook for attaching credentials (e.g. Bearer tokens) and handling
 * auth failures (401/403). Wire token storage and navigation here when the
 * app talks to a secured API.
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
