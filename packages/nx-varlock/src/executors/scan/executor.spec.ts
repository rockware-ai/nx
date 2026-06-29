import type { ExecutorContext } from '@nx/devkit';

import executor from './executor';
import * as runner from '../../utils/run-varlock';

const context: ExecutorContext = {
  root: '/workspace',
  cwd: process.cwd(),
  isVerbose: false,
  projectName: 'api',
  projectGraph: { nodes: {}, dependencies: {} },
  projectsConfigurations: {
    projects: { api: { root: 'apps/api' } },
    version: 2,
  },
  nxJsonConfiguration: {},
};

describe('Varlock scan executor', () => {
  let spawnSpy: jest.SpyInstance;

  beforeEach(() => {
    spawnSpy = jest.spyOn(runner, 'spawnVarlock').mockResolvedValue(0);
  });

  afterEach(() => jest.restoreAllMocks());

  it('succeeds when the scan is clean', async () => {
    const result = await executor({}, context);
    expect(result.success).toBe(true);
    expect(spawnSpy).toHaveBeenCalledWith(['scan'], '/workspace/apps/api');
  });

  it('fails when a leaked secret is found (exit 1)', async () => {
    spawnSpy.mockResolvedValue(1);
    const result = await executor({}, context);
    expect(result.success).toBe(false);
  });

  it('forwards flags and file globs', async () => {
    await executor({ staged: true, files: ['src/**/*.ts'] }, context);
    expect(spawnSpy).toHaveBeenCalledWith(
      ['scan', '--staged', 'src/**/*.ts'],
      '/workspace/apps/api',
    );
  });
});
