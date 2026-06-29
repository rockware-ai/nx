import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  type Tree,
  addProjectConfiguration,
  readJson,
  readProjectConfiguration,
} from '@nx/devkit';

import { initGenerator } from './generator';

describe('varlock init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'api', {
      root: 'apps/api',
      projectType: 'application',
      targets: {},
    });
  });

  it('creates a .env.schema in the project root', async () => {
    await initGenerator(tree, { project: 'api' });
    expect(tree.exists('apps/api/.env.schema')).toBe(true);
  });

  it('registers a validate target', async () => {
    await initGenerator(tree, { project: 'api' });
    const config = readProjectConfiguration(tree, 'api');
    expect(config.targets?.validate?.executor).toBe('nx:run-commands');
    expect(config.targets?.validate?.options?.command).toBe('varlock load');
  });

  it('adds varlock to devDependencies', async () => {
    await initGenerator(tree, { project: 'api' });
    const pkg = readJson(tree, 'package.json');
    expect(pkg.devDependencies.varlock).toBeDefined();
  });

  it('updates .gitignore with local override entries', async () => {
    await initGenerator(tree, { project: 'api' });
    const gitignore = tree.read('.gitignore', 'utf-8');
    expect(gitignore).toContain('.env.local');
    expect(gitignore).toContain('.env.*.local');
  });

  it('writes the schema at the workspace root when no project is given', async () => {
    await initGenerator(tree, {});
    expect(tree.exists('.env.schema')).toBe(true);
  });
});
