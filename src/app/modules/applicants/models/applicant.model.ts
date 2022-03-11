import {DatePipe} from '@angular/common';
import { JsonProperty } from 'json-object-mapper';
import {ROOT_CONFIG} from 'src/app/containers/root/config/root.config';

export class Applicant {
  @JsonProperty() public readonly firstName?: string;
  @JsonProperty() public readonly lastName?: string;
  @JsonProperty() public readonly availableFrom?: Date;
  @JsonProperty() public readonly skills?: string[];

  private readonly _datePipe: DatePipe;

  public constructor() {
    this.firstName = '';
    this.lastName = '';
    this.availableFrom = null;
    this.skills = [];

    this._datePipe = new DatePipe(ROOT_CONFIG.locale);
  }

  public get name(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  public get availability(): string {
    return this.availableFrom ? this._datePipe.transform(this.availableFrom, ROOT_CONFIG.dateFormat) : '-';
  }
}
