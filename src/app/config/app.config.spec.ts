import { APP_CONFIG } from './app.config';
import { Languages } from '../enums/language.enum';

describe('AppConfig', () => {
  it('should fallback to default locale if language unsupported', () => {
    expect(APP_CONFIG.getLocale('unsupported_lang' as any)).toBe('en-US');
  });

  it('should fallback to default date format if language unsupported', () => {
    expect(APP_CONFIG.getDateFormat('unsupported_lang' as any)).toBe(
      'MM/dd/yyyy'
    );
  });

  it('should get correct locale for French', () => {
    expect(APP_CONFIG.getLocale(Languages.French)).toBe('fr-FR');
  });

  it('should get correct date format for French', () => {
    expect(APP_CONFIG.getDateFormat(Languages.French)).toBe('dd/MM/yyyy');
  });
});
