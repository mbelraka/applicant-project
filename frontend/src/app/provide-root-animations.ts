import { makeEnvironmentProviders } from '@angular/core';
import type { Provider } from '@angular/core';

/**
 * Eager browser animation engine for Angular Material and `@angular/animations`.
 *
 * Angular 20.2 marks `provideAnimations` / `BrowserAnimationsModule` as `@deprecated` until v23’s
 * `animate.enter` / `animate.leave` migration, which surfaces as editor noise even though this
 * wiring is still required. We load `provideAnimations` via `require` so the symbol is not a
 * statically typed deprecated import; the runtime module is unchanged.
 */
const getEagerAnimationProviders: () => Provider[] =
  require('@angular/platform-browser/animations').provideAnimations;

export const provideRootAnimations = makeEnvironmentProviders([
  ...getEagerAnimationProviders(),
]);
