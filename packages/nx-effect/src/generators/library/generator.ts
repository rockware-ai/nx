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
import type { LibraryGeneratorSchema } from './schema';

export async function libraryGenerator(
  tree: Tree,
  options: LibraryGeneratorSchema,
): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];

  tasks.push(
    await initGenerator(tree, {
      platform: options.platform,
      skipFormat: true,
    }),
  );

  const { projectName, className, projectRoot, parsedTags } =
    normalizeProjectOptions(tree, options, 'library');

  const projectConfiguration: ProjectConfiguration = {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: joinPathFragments(projectRoot, 'src'),
    tags: parsedTags,
    targets: {
      build: {
        executor: '@nx/js:tsc',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: joinPathFragments('dist', projectRoot),
          main: joinPathFragments(projectRoot, 'src/index.ts'),
          tsConfig: joinPathFragments(projectRoot, 'tsconfig.lib.json'),
          assets: [joinPathFragments(projectRoot, '*.md')],
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

export default libraryGenerator;
