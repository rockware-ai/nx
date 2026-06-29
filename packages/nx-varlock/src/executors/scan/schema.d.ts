export interface ScanExecutorSchema {
  /** Only scan git-staged files (--staged). */
  staged?: boolean;
  /** Include .gitignore-listed files in the scan (--include-ignored). */
  includeIgnored?: boolean;
  /** Schema entry point (--path). */
  path?: string;
  /** Explicit file paths or globs to scan. */
  files?: string[];
}
