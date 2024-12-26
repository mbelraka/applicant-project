import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';

import { LocalizationService } from '../../../services/localization.service';
import { APP_CONFIG } from '../../../config/app.config';

export class Applicant {
  public readonly id!: string; // Required
  public readonly firstName?: string; // Optional
  public readonly lastName?: string; // Optional
  public readonly availableFrom?: Date; // Optional
  public readonly skills?: string[]; // Optional

  private _datePipe!: DatePipe;
  private _name: string | null = null;
  private _availability: string | null = null;

  /**
   * Constructor initializes properties and creates a DatePipe
   * based on the application locale.
   *
   * @param init - Initial values for the applicant.
   * @param localizationService
   */
  public constructor(
    init?: Partial<Applicant>,
    private localizationService: LocalizationService = inject(
      LocalizationService
    )
  ) {
    Object.assign(this, init);

    this.localizationService.getStoredLanguage().subscribe((lang) => {
      const locale = APP_CONFIG.getLocale(lang);
      this._datePipe = new DatePipe(locale);
    });
  }

  /**
   * Computes the full name of the applicant.
   *
   * @returns {string} - Full name in "First Last" format.
   */
  public get name(): string {
    if (!this._name) {
      this._name = `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }
    return this._name;
  }

  /**
   * Formats the availableFrom date to a user-friendly format or
   * returns a placeholder when no date is provided.
   *
   * @returns {string} - Formatted date or placeholder ('-').
   */
  public get availability(): string {
    if (!this._availability) {
      const dateFormat = this.localizationService
        .getStoredDateFormat()
        .getValue();
      this._availability = this.availableFrom
        ? (this._datePipe.transform(this.availableFrom, dateFormat) ?? '-')
        : '-';
    }
    return this._availability;
  }

  /**
   * Validates if the applicant object contains all required properties.
   *
   * @returns {boolean} - Returns true if valid, false otherwise.
   */
  public isValid(): boolean {
    return (
      !!this.id &&
      !!this.firstName &&
      !!this.lastName &&
      Array.isArray(this.skills) &&
      this.skills.length > 0
    );
  }

  /**
   * Checks if the applicant matches a given skill.
   *
   * @param skill - Skill to match.
   * @returns {boolean} - Returns true if the skill is present, false otherwise.
   */
  public hasSkill(skill: string): boolean {
    return this.skills?.includes(skill) ?? false;
  }
}
