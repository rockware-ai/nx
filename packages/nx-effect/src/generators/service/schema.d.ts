export interface ServiceGeneratorSchema {
  /** Service name (e.g. UserRepository). */
  name: string;
  /** The project where the service is created. */
  project: string;
  /** Directory under the project's source root for the service file. */
  directory?: string;
  /** Skip formatting files after generation. */
  skipFormat?: boolean;
}
