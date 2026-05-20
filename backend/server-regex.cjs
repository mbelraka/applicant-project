const SERVER_REGEX = {
  UNICODE_COMBINING_MARKS: /[\u0300-\u036f]/g,
  NON_ALPHANUMERIC_TO_SPACE: /[^a-z0-9\s]/g,
  WHITESPACE_RUN: /\s+/g,
  MIN_YEARS_EXPERIENCE: /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/i,
};

module.exports = {
  SERVER_REGEX,
};
