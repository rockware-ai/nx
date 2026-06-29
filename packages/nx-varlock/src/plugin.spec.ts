import type { CreateNodesContextV2 } from '@nx/devkit';

import { createNodesV2 } from './plugin';

describe('nx-varlock inference plugin', () => {
  const [glob, fn] = createNodesV2;

  const context = {
    nxJsonConfiguration: {},
    workspaceRoot: '/workspace',
  } as CreateNodesContextV2;

  it('matches .env.schema files', () => {
    expect(glob).toBe('**/.env.schema');
  });

  it('adds validate and scan-secrets targets for each schema', async () => {
    const results = await fn(['apps/api/.env.schema'], {}, context);
    const [, nodes] = results[0];
    const project = nodes.projects?.['apps/api'];
    expect(project?.targets?.['validate']?.command).toBe('varlock load');
    expect(project?.targets?.['validate']?.options?.cwd).toBe('apps/api');
    expect(project?.targets?.['scan-secrets']?.command).toBe('varlock scan');
  });

  it('honours custom target names', async () => {
    const results = await fn(
      ['apps/api/.env.schema'],
      { validateTargetName: 'env-check', scanTargetName: 'secrets' },
      context,
    );
    const [, nodes] = results[0];
    const project = nodes.projects?.['apps/api'];
    expect(project?.targets?.['env-check']).toBeDefined();
    expect(project?.targets?.['secrets']).toBeDefined();
  });

  it('omits cwd for a workspace-root schema', async () => {
    const results = await fn(['.env.schema'], {}, context);
    const [, nodes] = results[0];
    const project = nodes.projects?.['.'];
    expect(project?.targets?.['validate']?.options).toEqual({});
  });
});
