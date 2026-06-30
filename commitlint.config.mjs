/**
 * Conventional Commits linting. These commit types/scopes feed Nx Release's
 * changelog generation and conventional-commit version bumps, so keep them in
 * sync with how you want releases to read.
 *
 * Format: <type>(<scope>): <subject>
 *   e.g. feat(nx-effect): add app generator
 *        fix(nx-varlock): forward --staged to varlock scan
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scopes are optional, but when present prefer a known one.
    'scope-enum': [
      1,
      'always',
      ['nx-effect', 'nx-varlock', 'repo', 'release', 'deps', 'ci'],
    ],
    // Allow a slightly longer header than the 72-char default.
    'header-max-length': [2, 'always', 100],
  },
};
