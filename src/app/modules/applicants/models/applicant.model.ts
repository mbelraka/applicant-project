/** Legacy shape from persisted data before full-name merge. */
type ApplicantInit = Partial<Applicant> & {
  firstName?: string;
  lastName?: string;
};

export class Applicant {
  public readonly id!: string;
  public readonly name?: string;
  public readonly email?: string;
  public readonly phone?: string;
  public readonly location?: string;
  /** Whole years (or half steps), e.g. 3 or 3.5 */
  public readonly yearsOfExperience?: number;
  /** One of `ApplicationStatus` string values */
  public readonly applicationStatus?: string;
  public readonly currentJobTitle?: string;
  public readonly availableFrom?: Date;
  public readonly skills?: string[];
  public readonly notes?: string;

  public constructor(init?: ApplicantInit) {
    if (!init) {
      return;
    }
    const { firstName, lastName, yearsOfExperience, availableFrom, ...rest } =
      init;
    Object.assign(this, rest);
    const fromLegacy = `${firstName ?? ''} ${lastName ?? ''}`.trim();
    if (fromLegacy && !this.name?.trim()) {
      (this as { name?: string }).name = fromLegacy;
    }
    if (yearsOfExperience !== undefined && yearsOfExperience !== null) {
      const n = Number(yearsOfExperience);
      if (Number.isFinite(n)) {
        (this as { yearsOfExperience?: number }).yearsOfExperience = n;
      }
    }
    if (availableFrom !== undefined && availableFrom !== null) {
      const d =
        availableFrom instanceof Date
          ? availableFrom
          : new Date(availableFrom as string | number);
      if (!Number.isNaN(d.getTime())) {
        (this as { availableFrom?: Date }).availableFrom = d;
      }
    }
  }

  public isValid(): boolean {
    return (
      !!this.id &&
      !!this.name?.trim() &&
      !!this.email?.trim() &&
      !!this.phone?.trim() &&
      Array.isArray(this.skills) &&
      this.skills.length > 0
    );
  }

  public hasSkill(skill: string): boolean {
    return this.skills?.includes(skill) ?? false;
  }
}
