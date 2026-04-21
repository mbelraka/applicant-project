import { MatIconRegistry } from '@angular/material/icon';
import {
  MATERIAL_SYMBOLS_OUTLINED_FONT_SET,
  registerMaterialSymbolsOutlinedFont,
} from './material-symbols-outlined-font.initializer';

describe('MaterialSymbolsOutlinedFontInitializer', () => {
  it('should register font class alias', () => {
    const mockRegistry = jasmine.createSpyObj<MatIconRegistry>(
      'MatIconRegistry',
      ['registerFontClassAlias']
    );

    // Call the initializer factory which returns a function
    const initializerFn = registerMaterialSymbolsOutlinedFont(mockRegistry);

    // Ensure the factory returns a function
    expect(typeof initializerFn).toBe('function');

    // Call the returned initializer function
    initializerFn();

    // Verify registry was called with correct parameters
    expect(mockRegistry.registerFontClassAlias).toHaveBeenCalledWith(
      MATERIAL_SYMBOLS_OUTLINED_FONT_SET,
      `${MATERIAL_SYMBOLS_OUTLINED_FONT_SET} mat-ligature-font`
    );
  });
});
