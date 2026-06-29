# @rafarochas91/nx-varlock

An [Nx](https://nx.dev) plugin for [Varlock](https://varlock.dev) — AI-safe
environment variable management. It validates and injects env vars from your
`.env.schema`, scans for leaked secrets, and can infer targets automatically for
every project that has a `.env.schema`.

## Install

```sh
npm install --save-dev @rafarochas91/nx-varlock
# or
nx add @rafarochas91/nx-varlock
```

`varlock` itself is added to your `devDependencies` by the `init` generator.

## Generator

### `init` (alias `setup`)

Scaffold a `.env.schema`, install `varlock`, register a `validate` target on the
project and add encrypted-override entries to `.gitignore`.

```sh
nx g @rafarochas91/nx-varlock:init --project my-app
```

| Option            | Type      | Default | Description                                     |
| ----------------- | --------- | ------- | ----------------------------------------------- |
| `project`         | `string`  | —       | Target project. Omit to use the workspace root. |
| `skipSchema`      | `boolean` | `false` | Do not create a `.env.schema`.                  |
| `skipTarget`      | `boolean` | `false` | Do not register a `validate` target.            |
| `skipPackageJson` | `boolean` | `false` | Do not add `varlock` to `devDependencies`.      |
| `skipFormat`      | `boolean` | `false` | Skip formatting files after generation.         |

## Executors

### `run`

Run a command with environment variables validated and injected by
`varlock run -- <command>`.

```jsonc
// project.json
{
  "targets": {
    "serve": {
      "executor": "@rafarochas91/nx-varlock:run",
      "options": {
        "command": "node dist/main.js",
        "env": "production"
      }
    }
  }
}
```

| Option            | Type                          | Description                              |
| ----------------- | ----------------------------- | ---------------------------------------- |
| `command`         | `string`                      | Command to run (or use `commands`).      |
| `commands`        | `string[]`                    | Multiple commands, run sequentially.     |
| `env`             | `string`                      | Environment context (`--env`).           |
| `path`            | `string`                      | Schema entry point (`--path`).           |
| `inject`          | `'all' \| 'vars' \| 'blob'`   | Injection mode (`--inject`).             |
| `redactStdout`    | `boolean`                     | Force/disable stdout redaction.          |
| `includeInternal` | `boolean`                     | Pass `@internal` items to the child.     |
| `skipCache`       | `boolean`                     | Bypass the encrypted disk cache.         |

### `scan`

Detect plaintext secrets with `varlock scan`. Exits non-zero on a leak — ideal
for CI and pre-commit hooks.

```jsonc
{
  "targets": {
    "scan-secrets": {
      "executor": "@rafarochas91/nx-varlock:scan",
      "options": { "staged": true }
    }
  }
}
```

| Option           | Type       | Description                                |
| ---------------- | ---------- | ------------------------------------------ |
| `staged`         | `boolean`  | Only scan git-staged files (`--staged`).   |
| `includeIgnored` | `boolean`  | Include `.gitignore`d files.               |
| `path`           | `string`   | Schema entry point (`--path`).             |
| `files`          | `string[]` | Explicit file paths or globs to scan.      |

## Inferred targets (`createNodesV2`)

Register the plugin in `nx.json` and every project containing a `.env.schema`
gets `validate` and `scan-secrets` targets automatically — no `project.json`
edits required.

```jsonc
// nx.json
{
  "plugins": [
    {
      "plugin": "@rafarochas91/nx-varlock",
      "options": {
        "validateTargetName": "validate",
        "scanTargetName": "scan-secrets"
      }
    }
  ]
}
```

## License

MIT
