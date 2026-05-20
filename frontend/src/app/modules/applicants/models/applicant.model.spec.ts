import { Applicant } from './applicant.model';

describe('Applicant Model', () => {
  it('should initialize empty if no init provided', () => {
    const applicant = new Applicant();
    expect(applicant.id).toBeUndefined();
  });

  it('should populate from legacy names', () => {
    const applicant = new Applicant({
      firstName: 'John',
      lastName: 'Doe',
    } as any);
    expect(applicant.name).toBe('John Doe');
  });

  it('should not populate legacy name if name exists', () => {
    const applicant = new Applicant({
      firstName: 'John',
      lastName: 'Doe',
      name: 'Real Name',
    } as any);
    expect(applicant.name).toBe('Real Name');
  });

  it('should handle numeric experience', () => {
    const applicant = new Applicant({ yearsOfExperience: '5' } as any);
    expect(applicant.yearsOfExperience).toBe(5);

    const applicantInvalidExp = new Applicant({
      yearsOfExperience: 'abc',
    } as any);
    expect(applicantInvalidExp.yearsOfExperience).toBeUndefined();
  });

  it('should handle availableFrom dates strings and numbers', () => {
    const applicantStr = new Applicant({ availableFrom: '2024-01-01' } as any);
    expect(applicantStr.availableFrom).toBeInstanceOf(Date);

    const applicantNum = new Applicant({ availableFrom: 1704067200000 } as any); // 2024-01-01
    expect(applicantNum.availableFrom).toBeInstanceOf(Date);

    const applicantInvalid = new Applicant({ availableFrom: 'invalid' } as any);
    expect(applicantInvalid.availableFrom).toBeUndefined();
  });

  it('should evaluate isValid correctly', () => {
    const invalidEmpty = new Applicant();
    expect(invalidEmpty.isValid()).toBeFalse();

    const valid = new Applicant({
      id: '1',
      name: 'John',
      email: 'a@a.com',
      phone: '123',
      skills: ['A'],
    });
    expect(valid.isValid()).toBeTrue();

    const invalidNoSkills = new Applicant({
      id: '1',
      name: 'John',
      email: 'a@a.com',
      phone: '123',
      skills: [],
    });
    expect(invalidNoSkills.isValid()).toBeFalse();
  });

  it('should evaluate hasSkill correctly', () => {
    const applicant = new Applicant({ skills: ['Angular', 'React'] } as any);
    expect(applicant.hasSkill('Angular')).toBeTrue();
    expect(applicant.hasSkill('Vue')).toBeFalse();

    const noSkills = new Applicant();
    expect(noSkills.hasSkill('Angular')).toBeFalse();
  });
});
