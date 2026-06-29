export interface LibraryGeneratorSchema {
  /** Library name. */
  name: string;
  /** Directory where the library is placed, relative to the workspace root. */
  directory?: string;
  /** Comma-separated tags applied to the project. */
  tags?: string;
  /** Install and use @effect/platform packages. */
  platform?: boolean;
  /** Skip formatting files after generation. */
  skipFormat?: boolean;
}
