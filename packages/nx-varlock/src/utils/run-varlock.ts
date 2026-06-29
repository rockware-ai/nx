import { type ExecutorContext, logger } from '@nx/devkit';
import { spawn } from 'child_process';

/**
 * Resolves the working directory for a varlock invocation. We prefer the root
 * of the project the target belongs to so that the nearest `.env.schema` is
 * picked up, falling back to the workspace root.
 */
export function resolveCwd(context: ExecutorContext): string {
  const projectName = context.projectName;
  const projectRoot =
    projectName &&
    context.projectsConfigurations?.projects?.[projectName]?.root;
  return projectRoot ? `${context.root}/${projectRoot}` : context.root;
}

/**
 * Spawns `varlock` with the given args, streaming stdio through to the parent.
 * Resolves with the child's exit code. Terminating signals are forwarded so
 * the child can run its own shutdown handlers.
 */
export function spawnVarlock(
  args: string[],
  cwd: string,
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    logger.info(`> varlock ${args.join(' ')}`);

    const child = spawn('varlock', args, {
      cwd,
      stdio: 'inherit',
      shell: false,
    });

    const forward = (signal: NodeJS.Signals) => {
      if (!child.killed) {
        child.kill(signal);
      }
    };
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    signals.forEach((signal) => process.on(signal, forward));

    const cleanup = () =>
      signals.forEach((signal) => process.off(signal, forward));

    child.on('error', (error) => {
      cleanup();
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(
          new Error(
            'Could not find the `varlock` binary. Install it with `npm install --save-dev varlock`.',
          ),
        );
        return;
      }
      reject(error);
    });

    child.on('close', (code) => {
      cleanup();
      resolve(code ?? 0);
    });
  });
}
