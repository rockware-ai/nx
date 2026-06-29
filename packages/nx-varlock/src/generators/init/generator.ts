import {
  addDependenciesToPackageJson,
  formatFiles,
  type GeneratorCallback,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
  runTasksInSerial,
  type Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { varlockVersion } from '../../versions';
import type { InitGeneratorSchema } from './schema';

/** Appends entries to .gitignore if they are not already present. */
function ensureGitignore(tree: Tree, entries: string[]): void {
  const current = tree.exists('.gitignore')
    ? (tree.read('.gitignore', 'utf-8') ?? '')
    : '';
  const missing = entries.filter(
    (entry) => !current.split('\n').some((line) => line.trim() === entry),
  );
  if (missing.length === 0) return;

  const prefix = current.endsWith('\n') || current === '' ? '' : '\n';
  tree.write(
    '.gitignore',
    `${current}${prefix}\n# varlock — encrypted local overrides\n${missing.join('\n')}\n`,
  );
}

export async function initGenerator(
  tree: Tree,
  options: InitGeneratorSchema,
): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];

  // Resolve the directory the schema/target apply to.
  let projectRoot = '.';
  if (options.project) {
    const project = readProjectConfiguration(tree, options.project);
    projectRoot = project.root;
  }

  if (!options.skipSchema) {
    const schemaPath = joinPathFragments(projectRoot, '.env.schema');
    if (!tree.exists(schemaPath)) {
      generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
        tmpl: '',
      });
    }
  }

  if (!options.skipTarget && options.project) {
    const project = readProjectConfiguration(tree, options.project);
    project.targets ??= {};
    project.targets['validate'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'varlock load',
        cwd: projectRoot,
      },
    };
    updateProjectConfiguration(tree, options.project, project);
  }

  ensureGitignore(tree, ['.env.local', '.env.*.local']);

  if (!options.skipPackageJson) {
    tasks.push(
      addDependenciesToPackageJson(tree, {}, { varlock: varlockVersion }),
    );
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
