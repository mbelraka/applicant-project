import { MatIconRegistry } from '@angular/material/icon';

/** `fontSet` value for templates; pairs with `registerMaterialSymbolsOutlinedFont`. */
export const MATERIAL_SYMBOLS_OUTLINED_FONT_SET = 'material-symbols-outlined';

/**
 * Registers the font class alias so `fontSet` + `fontIcon` ligatures use Material Symbols
 * Outlined (with `mat-ligature-font`). Use with `provideAppInitializer` and `inject(MatIconRegistry)`.
 */
export function registerMaterialSymbolsOutlinedFont(
  registry: MatIconRegistry
): () => void {
  return () => {
    registry.registerFontClassAlias(
      MATERIAL_SYMBOLS_OUTLINED_FONT_SET,
      `${MATERIAL_SYMBOLS_OUTLINED_FONT_SET} mat-ligature-font`
    );
  };
}
