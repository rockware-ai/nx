export interface InitGeneratorSchema {
  /** The project to set up varlock for. Defaults to the workspace root. */
  project?: string;
  /** Do not create a .env.schema file. */
  skipSchema?: boolean;
  /** Do not register a `validate` target on the project. */
  skipTarget?: boolean;
  /** Do not add varlock to devDependencies. */
  skipPackageJson?: boolean;
  /** Skip formatting files after generation. */
  skipFormat?: boolean;
}
