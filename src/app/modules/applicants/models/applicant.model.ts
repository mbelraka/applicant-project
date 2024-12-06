import { DatePipe } from '@angular/common';
import { JsonProperty } from 'json-object-mapper';
import { LocalizationService } from '../../../services/localization.service';
import { APP_CONFIG } from '../../../config/app.config';
import { inject } from '@angular/core';

//import { LocalizationService } from 'src/app/core/services/localization.service';

export class Applicant {
  @JsonProperty() public readonly id: string;
  @JsonProperty() public readonly firstName?: string;
  @JsonProperty() public readonly lastName?: string;
  @JsonProperty() public readonly availableFrom?: Date;
  @JsonProperty() public readonly skills?: string[];

  private _datePipe: DatePipe;

  /**
   * Constructor initializes the properties and creates a DatePipe
   * based on the application's selected locale.
   *
   * @param localizationService - Service to fetch the application's locale.
   */
  public constructor(
    private localizationService: LocalizationService = inject(
      LocalizationService
    )
  ) {
    this.id = '';
    this.firstName = '';
    this.lastName = '';
    this.availableFrom = null;
    this.skills = [];

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
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }

  /**
   * Formats the availableFrom date to a user-friendly format or
   * returns a placeholder when no date is provided.
   *
   * @returns {string} - Formatted date or placeholder ('-').
   */
  public get availability(): string {
    const dateFormat = this.localizationService
      .getStoredDateFormat()
      .getValue();
    return this.availableFrom
      ? (this._datePipe.transform(this.availableFrom, dateFormat) ?? '-')
      : '-';
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
