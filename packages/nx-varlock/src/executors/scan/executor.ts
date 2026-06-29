import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { resolveCwd, spawnVarlock } from '../../utils/run-varlock';
import type { ScanExecutorSchema } from './schema';

const scanExecutor: PromiseExecutor<ScanExecutorSchema> = async (
  options,
  context: ExecutorContext,
) => {
  const args = ['scan'];

  if (options.staged) args.push('--staged');
  if (options.includeIgnored) args.push('--include-ignored');
  if (options.path) args.push('--path', options.path);
  if (options.files?.length) args.push(...options.files);

  const cwd = resolveCwd(context);
  // varlock scan exits 0 when clean, 1 when a leaked secret is found.
  const code = await spawnVarlock(args, cwd);

  return { success: code === 0 };
};

export default scanExecutor;
