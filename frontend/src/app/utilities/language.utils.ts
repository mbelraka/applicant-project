import { Languages } from '../enums/language.enum';

const LANGUAGE_VALUES = new Set<string>(Object.values(Languages));

export function isLanguage(value: unknown): value is Languages {
  return typeof value === 'string' && LANGUAGE_VALUES.has(value);
}
