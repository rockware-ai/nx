# nx-plugins

A monorepo of [Nx](https://nx.dev) plugins, built and released with Nx itself.

| Package                                             | Description                                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`@rockware-ai/nx-effect`](./packages/nx-effect)   | Generators for [Effect](https://effect.website) libraries, services/layers and apps.         |
| [`@rockware-ai/nx-varlock`](./packages/nx-varlock) | Generator, executors and inferred targets for [Varlock](https://varlock.dev) env management. |

## Using the plugins

Both packages publish under the `@rockware-ai` scope on npm. Add them to an
existing Nx workspace with `nx add` (recommended — runs the `init` generator and
updates `nx.json`) or install them manually with your package manager.

### `@rockware-ai/nx-effect`

Scaffolds Effect libraries, services/layers and runnable Node apps wired up
with `@effect/vitest`.

```sh
# Install + run the init generator
nx add @rockware-ai/nx-effect

# Generate a library with a sample Context.Tag service + live Layer
nx g @rockware-ai/nx-effect:library my-lib

# Add another service into an existing project
nx g @rockware-ai/nx-effect:service UserRepository --project my-lib

# Generate a runnable app (entrypoint at src/main.ts via NodeRuntime.runMain)
nx g @rockware-ai/nx-effect:app my-app
nx serve my-app
```

See [packages/nx-effect/README.md](./packages/nx-effect/README.md) for the full
list of generators and options.

### `@rockware-ai/nx-varlock`

Validates, injects and scans environment variables using
[Varlock](https://varlock.dev). Ships an `init` generator, `run` / `scan`
executors, and inferred targets via `createNodesV2`.

```sh
# Install + scaffold a .env.schema, register a `validate` target
nx add @rockware-ai/nx-varlock
nx g @rockware-ai/nx-varlock:init --project my-app

# Validate the schema
nx validate my-app

# Scan staged files for plaintext secrets (great for pre-commit/CI)
nx scan-secrets my-app
```

Register the plugin in `nx.json` to get `validate` and `scan-secrets` targets
inferred automatically for every project that has a `.env.schema`:

```jsonc
// nx.json
{
  "plugins": [
    {
      "plugin": "@rockware-ai/nx-varlock",
      "options": {
        "validateTargetName": "validate",
        "scanTargetName": "scan-secrets"
      }
    }
  ]
}
```

Use the `run` executor to wrap any command with `varlock run --`:

```jsonc
// project.json
{
  "targets": {
    "serve": {
      "executor": "@rockware-ai/nx-varlock:run",
      "options": {
        "command": "node dist/main.js",
        "env": "production"
      }
    }
  }
}
```

See [packages/nx-varlock/README.md](./packages/nx-varlock/README.md) for the
full executor and generator option reference.

## Contributing

Contributions are welcome — bug reports, feature requests and PRs.

### Workspace setup

Requires Node 22+ and [pnpm](https://pnpm.io) (the workspace pins
`pnpm@11.9.0`).

```sh
pnpm install
```

Husky installs git hooks on `pnpm install`:

- `pre-commit` — runs the full `nx run-many -t test` matrix.
- `commit-msg` — lints messages with commitlint.

### Project layout

```
packages/
  nx-effect/    # @rockware-ai/nx-effect
  nx-varlock/   # @rockware-ai/nx-varlock
```

### Day-to-day commands

Always run tasks through Nx so caching and target dependencies kick in.

```sh
# Build / test / lint a single plugin
nx build nx-effect
nx test nx-varlock
nx lint nx-effect

# Everything
nx run-many -t lint test build

# Only affected projects (great in CI)
nx affected -t lint test build

# Try a generator without writing to disk
nx g @rockware-ai/nx-effect:library demo --dry-run
```

### Working on a generator or executor

1. Add or update the schema in `packages/<plugin>/src/generators/<name>/schema.json`
   (or `src/executors/<name>/schema.json`) and the matching TypeScript
   implementation.
2. Register it in `generators.json` / `executors.json`.
3. Add a Jest test alongside the source file. Generators should use the Nx
   `createTreeWithEmptyWorkspace` helper; executors should be unit-tested with
   a mocked `ExecutorContext`.
4. Update the plugin's `README.md` with any new options.
5. Verify locally end-to-end against the Verdaccio registry shipped in
   `.verdaccio/` if your change affects publish artifacts.

### Commit conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and
feed Nx Release's changelog + version bumps. The format is:

```
<type>(<scope>): <subject>
```

Allowed scopes (see [`commitlint.config.mjs`](./commitlint.config.mjs)):
`nx-effect`, `nx-varlock`, `repo`, `release`, `deps`, `ci`.

```
feat(nx-effect): add app generator
fix(nx-varlock): forward --staged to varlock scan
chore(repo): bump pnpm to 11.9.0
```

### Pull requests

- Branch off `main` and keep PRs scoped to a single change.
- Make sure `nx run-many -t lint test build` passes locally.
- Update the relevant package README when you change a public-facing flag,
  generator option or executor schema.
- Don't bump versions or edit `CHANGELOG.md` by hand — Nx Release handles
  versioning from the commit history.

## Releasing

Versioning and publishing are handled by
[Nx Release](https://nx.dev/features/manage-releases). Each package versions
independently and tags as `<projectName>@<version>`.

```sh
# Cut a version, update changelogs and create git tags (dry run first!)
nx release --dry-run
nx release

# Publish the built packages to npm
nx release publish
```

Both packages publish under the `@rockware-ai` scope with public access.

## License

MIT
