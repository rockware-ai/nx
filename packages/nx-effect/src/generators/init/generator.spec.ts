import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree, readJson } from '@nx/devkit';

import { initGenerator } from './generator';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('adds effect as a dependency', async () => {
    await initGenerator(tree, {});
    const pkg = readJson(tree, 'package.json');
    expect(pkg.dependencies.effect).toBeDefined();
  });

  it('adds platform packages when requested', async () => {
    await initGenerator(tree, { platform: true });
    const pkg = readJson(tree, 'package.json');
    expect(pkg.dependencies['@effect/platform']).toBeDefined();
    expect(pkg.dependencies['@effect/platform-node']).toBeDefined();
  });

  it('skips package.json when skipPackageJson is set', async () => {
    await initGenerator(tree, { skipPackageJson: true });
    const pkg = readJson(tree, 'package.json');
    expect(pkg.dependencies?.effect).toBeUndefined();
  });
});
