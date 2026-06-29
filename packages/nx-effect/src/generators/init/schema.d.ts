export interface InitGeneratorSchema {
  /** Also install @effect/platform and @effect/platform-node. */
  platform?: boolean;
  /** Skip formatting files after generation. */
  skipFormat?: boolean;
  /** Do not add dependencies to package.json. */
  skipPackageJson?: boolean;
}
