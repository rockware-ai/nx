import {
  type CreateNodesContextV2,
  type CreateNodesV2,
  createNodesFromFiles,
  type TargetConfiguration,
} from '@nx/devkit';
import { dirname } from 'path';

export interface VarlockPluginOptions {
  /** Name of the inferred validation target. Defaults to "validate". */
  validateTargetName?: string;
  /** Name of the inferred secret-scan target. Defaults to "scan-secrets". */
  scanTargetName?: string;
}

// Match any `.env.schema` file in the workspace; its directory is the project.
const schemaGlob = '**/.env.schema';

function buildTargets(
  options: VarlockPluginOptions | undefined,
  projectRoot: string,
): Record<string, TargetConfiguration> {
  const validateTargetName = options?.validateTargetName ?? 'validate';
  const scanTargetName = options?.scanTargetName ?? 'scan-secrets';

  const cwdOption = projectRoot === '.' ? {} : { cwd: projectRoot };

  return {
    [validateTargetName]: {
      command: 'varlock load',
      options: cwdOption,
      metadata: {
        description: 'Validate environment variables against .env.schema',
        technologies: ['varlock'],
      },
    },
    [scanTargetName]: {
      command: 'varlock scan',
      options: cwdOption,
      metadata: {
        description: 'Scan for plaintext secrets with varlock',
        technologies: ['varlock'],
      },
    },
  };
}

export const createNodesV2: CreateNodesV2<VarlockPluginOptions> = [
  schemaGlob,
  async (schemaFiles, options, context: CreateNodesContextV2) => {
    return createNodesFromFiles(
      (schemaFile) => {
        const projectRoot = dirname(schemaFile);

        return {
          projects: {
            [projectRoot]: {
              targets: buildTargets(options, projectRoot),
            },
          },
        };
      },
      schemaFiles,
      options,
      context,
    );
  },
];
