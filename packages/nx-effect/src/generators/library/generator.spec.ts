import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree, readProjectConfiguration, readJson } from '@nx/devkit';

import { libraryGenerator } from './generator';
import type { LibraryGeneratorSchema } from './schema';

describe('library generator', () => {
  let tree: Tree;
  const options: LibraryGeneratorSchema = { name: 'my-lib' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('creates the project with build and test targets', async () => {
    await libraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'my-lib');
    expect(config.root).toBe('my-lib');
    expect(config.targets?.build?.executor).toBe('@nx/js:tsc');
    expect(config.targets?.test?.executor).toBe('nx:run-commands');
    expect(config.targets?.test?.options?.command).toBe('vitest run');
  });

  it('generates source, test and config files', async () => {
    await libraryGenerator(tree, options);
    expect(tree.exists('my-lib/src/index.ts')).toBe(true);
    expect(tree.exists('my-lib/src/lib/my-lib.ts')).toBe(true);
    expect(tree.exists('my-lib/src/lib/my-lib.spec.ts')).toBe(true);
    expect(tree.exists('my-lib/vite.config.ts')).toBe(true);
    expect(tree.exists('my-lib/tsconfig.lib.json')).toBe(true);
  });

  it('adds effect and vitest dependencies', async () => {
    await libraryGenerator(tree, options);
    const pkg = readJson(tree, 'package.json');
    expect(pkg.dependencies.effect).toBeDefined();
    expect(pkg.devDependencies.vitest).toBeDefined();
    expect(pkg.devDependencies['@effect/vitest']).toBeDefined();
  });

  it('respects a custom directory and tags', async () => {
    await libraryGenerator(tree, {
      name: 'my-lib',
      directory: 'libs/nested/my-lib',
      tags: 'scope:shared,type:util',
    });
    const config = readProjectConfiguration(tree, 'my-lib');
    expect(config.root).toBe('libs/nested/my-lib');
    expect(config.tags).toEqual(['scope:shared', 'type:util']);
  });
});
