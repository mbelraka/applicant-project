export const ROOT_CONFIG = {
  navLinks: [
    { label: 'Main', link: '/main' },
    { label: 'Bewerber', link: '/applicants', showHeader: true },
  ],
  actions: {
    newApplicant: 'newApplicant',
    deleteApplicant: 'deleteApplicant',
  },
  dialogConfig: {
    autoFocus: false,
    disableClose: true,
  },
  dateFormat: 'dd.MM.yyyy',
  locale: 'de-DE',
};
