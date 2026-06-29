import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  type Tree,
} from '@nx/devkit';
import * as path from 'path';
import type { ServiceGeneratorSchema } from './schema';

export async function serviceGenerator(
  tree: Tree,
  options: ServiceGeneratorSchema,
): Promise<void> {
  const project = readProjectConfiguration(tree, options.project);
  const sourceRoot =
    project.sourceRoot ?? joinPathFragments(project.root, 'src');

  const { className, fileName, propertyName } = names(options.name);
  const targetDir = joinPathFragments(
    sourceRoot,
    options.directory ?? 'lib',
  );

  generateFiles(tree, path.join(__dirname, 'files'), targetDir, {
    className,
    fileName,
    propertyName,
    serviceTag: `${options.project}/${className}`,
    tmpl: '',
  });

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default serviceGenerator;
