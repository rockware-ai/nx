export interface RunExecutorSchema {
  /** A single command to execute with injected env vars. */
  command?: string;
  /** Multiple commands to run sequentially, each wrapped by varlock. */
  commands?: string[];
  /** Environment context passed to varlock as --env. */
  env?: string;
  /** Custom .env schema entry point (--path). */
  path?: string;
  /** Injection mode (--inject). */
  inject?: 'all' | 'vars' | 'blob';
  /** Force redaction of sensitive values in stdout. */
  redactStdout?: boolean;
  /** Pass @internal items through to the child process. */
  includeInternal?: boolean;
  /** Bypass the encrypted disk cache (--skip-cache). */
  skipCache?: boolean;
}
