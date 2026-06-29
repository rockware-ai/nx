import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Tree, addProjectConfiguration } from '@nx/devkit';

import { serviceGenerator } from './generator';

describe('service generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'my-lib', {
      root: 'libs/my-lib',
      sourceRoot: 'libs/my-lib/src',
      projectType: 'library',
      targets: {},
    });
  });

  it('creates the service and its test', async () => {
    await serviceGenerator(tree, { name: 'user-repo', project: 'my-lib' });
    expect(tree.exists('libs/my-lib/src/lib/user-repo.ts')).toBe(true);
    expect(tree.exists('libs/my-lib/src/lib/user-repo.spec.ts')).toBe(true);
  });

  it('uses a PascalCase class and a namespaced tag', async () => {
    await serviceGenerator(tree, { name: 'user-repo', project: 'my-lib' });
    const content = tree.read('libs/my-lib/src/lib/user-repo.ts', 'utf-8');
    expect(content).toContain('export class UserRepo extends Context.Tag');
    expect(content).toContain("'my-lib/UserRepo'");
  });
});
