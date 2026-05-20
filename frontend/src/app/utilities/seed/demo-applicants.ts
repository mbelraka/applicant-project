import { ApplicationStatus } from '../../modules/applicants/enums/application-status.enum';
import { Applicant } from '../../modules/applicants/models/applicant.model';

/** Demo rows used by `seedApplicants` (persisted via the same `addApplicant` flow as the dialog). */
export function buildDemoApplicants(): Applicant[] {
  const availableA = new Date();
  availableA.setMonth(availableA.getMonth() + 1);
  const availableB = new Date();
  availableB.setDate(availableB.getDate() + 14);
  const availableC = new Date();
  availableC.setDate(availableC.getDate() + 21);
  const availableD = new Date();
  availableD.setDate(availableD.getDate() + 7);
  const availableE = new Date();
  availableE.setMonth(availableE.getMonth() + 2);
  const availableF = new Date();
  availableF.setDate(availableF.getDate() + 30);
  const availableG = new Date();
  availableG.setDate(availableG.getDate() + 45);
  const availableH = new Date();
  availableH.setMonth(availableH.getMonth() + 3);
  const availableI = new Date();
  availableI.setDate(availableI.getDate() + 10);
  const availableJ = new Date();
  availableJ.setDate(availableJ.getDate() + 18);
  const availableK = new Date();
  availableK.setMonth(availableK.getMonth() + 1);
  availableK.setDate(availableK.getDate() + 5);
  return [
    new Applicant({
      id: 'a1b2c3d4-e5f6-41a8-9b0c-1d2e3f4a5b6c',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 415-555-0198',
      location: 'San Francisco, CA, USA',
      yearsOfExperience: 8,
      applicationStatus: ApplicationStatus.Screening,
      currentJobTitle: 'Senior Frontend Engineer',
      availableFrom: availableA,
      skills: ['Angular', 'TypeScript', 'NgRx'],
      notes: 'Open to hybrid arrangements.',
    }),
    new Applicant({
      id: 'b2c3d4e5-f6a7-42b9-8c1d-2e3f4a5b6c7d',
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      phone: '+44 20 7946 0958',
      location: 'London, UK',
      yearsOfExperience: 5,
      applicationStatus: ApplicationStatus.InterviewScheduled,
      currentJobTitle: 'QA Automation Lead',
      availableFrom: availableB,
      skills: ['RxJS', 'Jest', 'Playwright'],
      notes:
        'Strong CI background; asked about on-call expectations for the platform team.',
    }),
    new Applicant({
      id: 'c3d4e5f6-a7b8-43ca-9d2e-3f4a5b6c7d8e',
      name: 'Samira Okonkwo',
      email: 'samira.okonkwo@example.com',
      phone: '+49 30 12345678',
      location: 'Berlin, Germany',
      yearsOfExperience: 6,
      applicationStatus: ApplicationStatus.Received,
      currentJobTitle: 'UI Engineer',
      availableFrom: availableC,
      skills: ['SCSS', 'Accessibility', 'Material Design'],
      notes: 'Prefers fully remote EU time zones.',
    }),
    new Applicant({
      id: 'd4e5f6a7-b8c9-44db-9c0d-1e2f3a4b5c6d',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+1 647-555-0142',
      location: 'Toronto, ON, Canada',
      yearsOfExperience: 4,
      applicationStatus: ApplicationStatus.Shortlisted,
      currentJobTitle: 'Product Designer',
      availableFrom: availableD,
      skills: ['Figma', 'Design systems', 'User research'],
      notes:
        'Portfolio emphasizes B2B SaaS; asked about design–dev handoff process.',
    }),
    new Applicant({
      id: 'e5f6a7b8-c9d0-45ec-ad1e-2f3a4b5c6d7e',
      name: 'Marco Rossi',
      email: 'marco.rossi@example.com',
      phone: '+39 02 1234 5678',
      location: 'Milan, Italy',
      yearsOfExperience: 10,
      applicationStatus: ApplicationStatus.OfferExtended,
      currentJobTitle: 'Engineering Manager',
      availableFrom: availableE,
      skills: ['People leadership', 'System design', 'Java'],
      notes: 'Negotiating start date; references checked.',
    }),
    new Applicant({
      id: 'f6a7b8c9-d0e1-46fd-be2f-3a4b5c6d7e8f',
      name: 'Chen Wei',
      email: 'chen.wei@example.com',
      phone: '+65 6123 4567',
      location: 'Singapore',
      yearsOfExperience: 3,
      applicationStatus: ApplicationStatus.Rejected,
      currentJobTitle: 'Backend Engineer',
      availableFrom: availableF,
      skills: ['Node.js', 'PostgreSQL', 'Docker'],
      notes: 'Role filled internally; encouraged to apply again next quarter.',
    }),
    new Applicant({
      id: '071b2c3d-4e5f-46a8-9b1c-2d3e4f5a6b7c',
      name: 'Nina Kowalski',
      email: 'nina.kowalski@example.com',
      phone: '+48 22 555 0140',
      location: 'Warsaw, Poland',
      yearsOfExperience: 7,
      applicationStatus: ApplicationStatus.Withdrawn,
      currentJobTitle: 'DevOps Engineer',
      availableFrom: availableG,
      skills: ['Kubernetes', 'Terraform', 'AWS'],
      notes: 'Withdrew after accepting another offer.',
    }),
    new Applicant({
      id: '182c3d4e-5f60-47b9-8c2d-3e4f5a6b7c8d',
      name: 'Diego Alvarez',
      email: 'diego.alvarez@example.com',
      phone: '+34 91 555 0277',
      location: 'Madrid, Spain',
      yearsOfExperience: 4,
      applicationStatus: ApplicationStatus.Received,
      currentJobTitle: 'Full-stack Developer',
      availableFrom: availableH,
      skills: ['React', 'NestJS', 'GraphQL'],
      notes: 'Recently relocated from Barcelona.',
    }),
    new Applicant({
      id: '293d4e5f-6071-48ca-9d3e-4f5a6b7c8d9e',
      name: 'Fatoumata Diallo',
      email: 'fatoumata.diallo@example.com',
      phone: '+221 33 555 0199',
      location: 'Dakar, Senegal',
      yearsOfExperience: 5,
      applicationStatus: ApplicationStatus.Screening,
      currentJobTitle: 'Data Engineer',
      availableFrom: availableI,
      skills: ['Python', 'Spark', 'dbt'],
      notes: 'Strong ETL experience; prefers remote-first teams.',
    }),
    new Applicant({
      id: '304e5f60-7182-49db-a04f-5a6b7c8d9e0f',
      name: 'Yuki Tanaka',
      email: 'yuki.tanaka@example.com',
      phone: '+81 3-5555-0144',
      location: 'Tokyo, Japan',
      yearsOfExperience: 6,
      applicationStatus: ApplicationStatus.InterviewScheduled,
      currentJobTitle: 'Mobile Engineer',
      availableFrom: availableJ,
      skills: ['Swift', 'Kotlin', 'CI/CD'],
      notes: 'Interview panel scheduled for next week.',
    }),
    new Applicant({
      id: '415f6071-8293-40ec-b150-6b7c8d9e0f1a',
      name: 'Anna Nielsen',
      email: 'anna.nielsen@example.com',
      phone: '+45 32 555 0166',
      location: 'Copenhagen, Denmark',
      yearsOfExperience: 9,
      applicationStatus: ApplicationStatus.Shortlisted,
      currentJobTitle: 'Site Reliability Engineer',
      availableFrom: availableK,
      skills: ['Go', 'Prometheus', 'Incident response'],
      notes: 'Final reference check in progress.',
    }),
  ];
}

function isBlank(str: string | undefined | null): boolean {
  return str == null || String(str).trim() === '';
}

/**
 * For applicants whose `id` matches a demo row, fills empty/missing fields from the seed
 * so localStorage stays aligned with the canonical demo shape.
 */
export function normalizeApplicantsAgainstSeed(applicants: Applicant[]): {
  applicants: Applicant[];
  changed: boolean;
} {
  const seeds = buildDemoApplicants();
  const seedById = new Map(seeds.map((s) => [s.id, s]));
  let changed = false;

  const next = applicants.map((a) => {
    const seed = seedById.get(a.id);
    if (!seed) {
      return a;
    }

    const name = isBlank(a.name) ? seed.name : a.name;
    const email = isBlank(a.email) ? seed.email : a.email;
    const phone = isBlank(a.phone) ? seed.phone : a.phone;
    const location = isBlank(a.location) ? seed.location : a.location;
    const currentJobTitle = isBlank(a.currentJobTitle)
      ? seed.currentJobTitle
      : a.currentJobTitle;
    const notes = isBlank(a.notes) ? seed.notes : a.notes;

    const applicationStatus =
      isBlank(a.applicationStatus) && seed.applicationStatus
        ? seed.applicationStatus
        : a.applicationStatus;

    const yearsOfExperience =
      a.yearsOfExperience === undefined || a.yearsOfExperience === null
        ? seed.yearsOfExperience
        : a.yearsOfExperience;

    const skills =
      !a.skills || a.skills.length === 0
        ? seed.skills
          ? [...seed.skills]
          : []
        : [...a.skills];

    const availableFrom =
      a.availableFrom == null ? seed.availableFrom : a.availableFrom;

    if (
      name !== a.name ||
      email !== a.email ||
      phone !== a.phone ||
      location !== a.location ||
      currentJobTitle !== a.currentJobTitle ||
      notes !== a.notes ||
      applicationStatus !== a.applicationStatus ||
      yearsOfExperience !== a.yearsOfExperience ||
      JSON.stringify(skills) !== JSON.stringify(a.skills ?? []) ||
      (a.availableFrom == null && seed.availableFrom != null)
    ) {
      changed = true;
    }

    return new Applicant({
      id: a.id,
      name,
      email,
      phone,
      location,
      yearsOfExperience,
      applicationStatus,
      currentJobTitle,
      availableFrom,
      skills,
      notes,
    });
  });

  return { applicants: next, changed };
}
