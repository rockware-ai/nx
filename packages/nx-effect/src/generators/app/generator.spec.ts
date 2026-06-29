import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree, readProjectConfiguration, readJson } from '@nx/devkit';

import { appGenerator } from './generator';
import type { AppGeneratorSchema } from './schema';

describe('app generator', () => {
  let tree: Tree;
  const options: AppGeneratorSchema = { name: 'my-app' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('creates an application project with serve and build targets', async () => {
    await appGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'my-app');
    expect(config.projectType).toBe('application');
    expect(config.targets?.build?.executor).toBe('@nx/js:tsc');
    expect(config.targets?.serve?.executor).toBe('nx:run-commands');
  });

  it('generates entrypoint, program and test files', async () => {
    await appGenerator(tree, options);
    expect(tree.exists('my-app/src/main.ts')).toBe(true);
    expect(tree.exists('my-app/src/app.ts')).toBe(true);
    expect(tree.exists('my-app/src/app.spec.ts')).toBe(true);
  });

  it('installs the effect platform packages', async () => {
    await appGenerator(tree, options);
    const pkg = readJson(tree, 'package.json');
    expect(pkg.dependencies['@effect/platform-node']).toBeDefined();
  });
});
