import { getWorkspaceLayout, joinPathFragments, names, type Tree } from '@nx/devkit';

export interface NormalizedProjectOptions {
  /** The user-supplied name, normalised to file-name form. */
  projectName: string;
  /** Class/PascalCase form, handy inside templates. */
  className: string;
  /** Path of the project relative to the workspace root. */
  projectRoot: string;
  /** Tags parsed into an array. */
  parsedTags: string[];
}

export interface NormalizeProjectOptionsInput {
  name: string;
  directory?: string;
  tags?: string;
}

/**
 * Resolves the project name, root directory and tags consistently across
 * generators. When no directory is provided we fall back to the workspace
 * `libsDir`/`appsDir` layout convention.
 */
export function normalizeProjectOptions(
  tree: Tree,
  options: NormalizeProjectOptionsInput,
  projectType: 'library' | 'application',
): NormalizedProjectOptions {
  const { fileName, className } = names(options.name);
  const layout = getWorkspaceLayout(tree);
  const baseDir =
    projectType === 'library' ? layout.libsDir : layout.appsDir;

  const projectRoot = options.directory
    ? joinPathFragments(options.directory)
    : joinPathFragments(baseDir, fileName);

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    projectName: fileName,
    className,
    projectRoot,
    parsedTags,
  };
}
