import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  type GeneratorCallback,
  joinPathFragments,
  names,
  offsetFromRoot,
  type ProjectConfiguration,
  runTasksInSerial,
  type Tree,
} from '@nx/devkit';
import * as path from 'path';
import { initGenerator } from '../init/generator';
import { normalizeProjectOptions } from '../../utils/normalize-options';
import {
  effectVitestVersion,
  tsxVersion,
  viteTsconfigPathsVersion,
  viteVersion,
  vitestVersion,
} from '../../versions';
import type { AppGeneratorSchema } from './schema';

export async function appGenerator(
  tree: Tree,
  options: AppGeneratorSchema,
): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];

  // Apps always use @effect/platform-node for the runtime entrypoint.
  tasks.push(
    await initGenerator(tree, { platform: true, skipFormat: true }),
  );

  const { projectName, className, projectRoot, parsedTags } =
    normalizeProjectOptions(tree, options, 'application');

  const projectConfiguration: ProjectConfiguration = {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: joinPathFragments(projectRoot, 'src'),
    tags: parsedTags,
    targets: {
      build: {
        executor: '@nx/js:tsc',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: joinPathFragments('dist', projectRoot),
          main: joinPathFragments(projectRoot, 'src/main.ts'),
          tsConfig: joinPathFragments(projectRoot, 'tsconfig.app.json'),
          assets: [joinPathFragments(projectRoot, '*.md')],
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          command: `tsx --watch ${joinPathFragments(projectRoot, 'src/main.ts')}`,
        },
      },
      test: {
        executor: 'nx:run-commands',
        cache: true,
        outputs: [
          joinPathFragments('{workspaceRoot}', 'coverage', projectRoot),
        ],
        options: {
          command: 'vitest run',
          cwd: projectRoot,
        },
      },
    },
  };

  addProjectConfiguration(tree, projectName, projectConfiguration);

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    projectName,
    className,
    propertyName: names(projectName).propertyName,
    offsetFromRoot: offsetFromRoot(projectRoot),
    tmpl: '',
  });

  tasks.push(
    addDependenciesToPackageJson(
      tree,
      {},
      {
        vite: viteVersion,
        vitest: vitestVersion,
        '@effect/vitest': effectVitestVersion,
        'vite-tsconfig-paths': viteTsconfigPathsVersion,
        tsx: tsxVersion,
      },
    ),
  );

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default appGenerator;
