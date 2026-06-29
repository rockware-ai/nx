import { type ExecutorContext, type PromiseExecutor, logger } from '@nx/devkit';
import { resolveCwd, spawnVarlock } from '../../utils/run-varlock';
import type { RunExecutorSchema } from './schema';

/** Translates the shared executor options into `varlock run` flags. */
function buildBaseArgs(options: RunExecutorSchema): string[] {
  const args = ['run'];

  if (options.env) args.push('--env', options.env);
  if (options.path) args.push('--path', options.path);
  if (options.inject) args.push('--inject', options.inject);
  if (options.includeInternal) args.push('--include-internal');
  if (options.skipCache) args.push('--skip-cache');
  if (options.redactStdout === true) args.push('--redact-stdout');
  if (options.redactStdout === false) args.push('--no-redact-stdout');

  return args;
}

const runExecutor: PromiseExecutor<RunExecutorSchema> = async (
  options,
  context: ExecutorContext,
) => {
  const commands =
    options.commands ?? (options.command ? [options.command] : []);

  if (commands.length === 0) {
    logger.error('nx-varlock:run requires either `command` or `commands`.');
    return { success: false };
  }

  const cwd = resolveCwd(context);
  const baseArgs = buildBaseArgs(options);

  for (const command of commands) {
    // `varlock run -- <command>` injects validated env vars into the child.
    const args = [...baseArgs, '--', ...command.split(' ').filter(Boolean)];
    const code = await spawnVarlock(args, cwd);
    if (code !== 0) {
      return { success: false };
    }
  }

  return { success: true };
};

export default runExecutor;
