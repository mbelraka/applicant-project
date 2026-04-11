export class Applicant {
  public readonly id!: string;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly availableFrom?: Date;
  public readonly skills?: string[];

  private _name: string | null = null;

  public constructor(init?: Partial<Applicant>) {
    Object.assign(this, init);
  }

  public get name(): string {
    if (!this._name) {
      this._name = `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }
    return this._name;
  }

  public isValid(): boolean {
    return (
      !!this.id &&
      !!this.firstName &&
      !!this.lastName &&
      Array.isArray(this.skills) &&
      this.skills.length > 0
    );
  }

  public hasSkill(skill: string): boolean {
    return this.skills?.includes(skill) ?? false;
  }
}
