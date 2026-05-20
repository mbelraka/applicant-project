/**
 * Persisted on `Applicant.applicationStatus`; labels from `applicationStatus.*` i18n keys.
 * Status badge backgrounds: `shared/_application-status.scss` mixin (grid, list) and
 * `applicant.component.scss` (detail card).
 */
export enum ApplicationStatus {
  Received = 'received',
  Screening = 'screening',
  InterviewScheduled = 'interview_scheduled',
  Shortlisted = 'shortlisted',
  OfferExtended = 'offer_extended',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn',
}
