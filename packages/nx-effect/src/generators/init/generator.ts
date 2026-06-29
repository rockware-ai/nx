import {
  addDependenciesToPackageJson,
  formatFiles,
  type GeneratorCallback,
  runTasksInSerial,
  type Tree,
} from '@nx/devkit';
import {
  effectPlatformNodeVersion,
  effectPlatformVersion,
  effectVersion,
} from '../../versions';
import type { InitGeneratorSchema } from './schema';

export async function initGenerator(
  tree: Tree,
  options: InitGeneratorSchema,
): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];

  if (!options.skipPackageJson) {
    const dependencies: Record<string, string> = {
      effect: effectVersion,
    };

    if (options.platform) {
      dependencies['@effect/platform'] = effectPlatformVersion;
      dependencies['@effect/platform-node'] = effectPlatformNodeVersion;
    }

    tasks.push(addDependenciesToPackageJson(tree, dependencies, {}));
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
