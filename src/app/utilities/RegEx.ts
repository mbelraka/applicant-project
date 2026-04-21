/** Applicant phone: digits, +, parens, dots, spaces, hyphens; min length 5. */
export const APPLICANT_PHONE_PATTERN = /^[\d+().\s-]{5,}$/;

/** Collapse runs of whitespace to a single space (e.g. notes cleanup). */
export const WHITESPACE_RUN = /\s+/g;

/** CSV cell needs quoting if it contains quote, comma, or line break. */
export const CSV_FIELD_NEEDS_QUOTING = /[",\n\r]/;

/** Escape double quotes inside a CSV quoted field. */
export const CSV_DOUBLE_QUOTE = /"/g;
