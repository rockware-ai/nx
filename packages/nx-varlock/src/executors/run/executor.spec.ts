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

describe('Varlock run executor', () => {
  let spawnSpy: jest.SpyInstance;

  beforeEach(() => {
    spawnSpy = jest.spyOn(runner, 'spawnVarlock').mockResolvedValue(0);
  });

  afterEach(() => jest.restoreAllMocks());

  it('fails when no command is provided', async () => {
    const result = await executor({}, context);
    expect(result.success).toBe(false);
    expect(spawnSpy).not.toHaveBeenCalled();
  });

  it('wraps a single command in `varlock run -- ...`', async () => {
    const result = await executor({ command: 'node dist/main.js' }, context);
    expect(result.success).toBe(true);
    expect(spawnSpy).toHaveBeenCalledWith(
      ['run', '--', 'node', 'dist/main.js'],
      '/workspace/apps/api',
    );
  });

  it('forwards flags to varlock', async () => {
    await executor(
      { command: 'node main.js', env: 'production', inject: 'vars', skipCache: true },
      context,
    );
    expect(spawnSpy).toHaveBeenCalledWith(
      ['run', '--env', 'production', '--inject', 'vars', '--skip-cache', '--', 'node', 'main.js'],
      '/workspace/apps/api',
    );
  });

  it('runs multiple commands and stops on failure', async () => {
    spawnSpy.mockResolvedValueOnce(0).mockResolvedValueOnce(1);
    const result = await executor(
      { commands: ['first cmd', 'second cmd', 'third cmd'] },
      context,
    );
    expect(result.success).toBe(false);
    expect(spawnSpy).toHaveBeenCalledTimes(2);
  });
});
