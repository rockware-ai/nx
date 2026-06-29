export interface AppGeneratorSchema {
  /** Application name. */
  name: string;
  /** Directory where the app is placed, relative to the workspace root. */
  directory?: string;
  /** Comma-separated tags applied to the project. */
  tags?: string;
  /** Skip formatting files after generation. */
  skipFormat?: boolean;
}
