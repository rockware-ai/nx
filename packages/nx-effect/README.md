# @rockware-ai/nx-effect

An [Nx](https://nx.dev) plugin for [Effect](https://effect.website). It provides
generators for scaffolding Effect libraries, services/layers and runnable
applications, all wired up with [Vitest](https://vitest.dev) via
[`@effect/vitest`](https://effect.website/docs/testing).

## Install

```sh
npm install --save-dev @rockware-ai/nx-effect
# or
nx add @rockware-ai/nx-effect
```

## Generators

### `init`

Install Effect into the workspace.

```sh
nx g @rockware-ai/nx-effect:init
nx g @rockware-ai/nx-effect:init --platform   # also add @effect/platform(+node)
```

| Option            | Type      | Default | Description                             |
| ----------------- | --------- | ------- | --------------------------------------- |
| `platform`        | `boolean` | `false` | Also install `@effect/platform[-node]`. |
| `skipPackageJson` | `boolean` | `false` | Do not modify `package.json`.           |
| `skipFormat`      | `boolean` | `false` | Skip formatting files after generation. |

### `library` (alias `lib`)

Generate an Effect library with a sample `Context.Tag` service, a live `Layer`,
an accessor and an `@effect/vitest` test.

```sh
nx g @rockware-ai/nx-effect:library my-lib
nx g @rockware-ai/nx-effect:library my-lib --directory libs/domain/my-lib --tags scope:shared
```

| Option       | Type      | Description                               |
| ------------ | --------- | ----------------------------------------- |
| `name`       | `string`  | Library name (required).                  |
| `directory`  | `string`  | Directory relative to the workspace root. |
| `tags`       | `string`  | Comma-separated project tags.             |
| `platform`   | `boolean` | Install and use `@effect/platform`.       |
| `skipFormat` | `boolean` | Skip formatting files after generation.   |

### `service`

Add an Effect `Context.Tag` service with a live `Layer` to an existing project.

```sh
nx g @rockware-ai/nx-effect:service UserRepository --project my-lib
```

| Option       | Type      | Description                                            |
| ------------ | --------- | ------------------------------------------------------ |
| `name`       | `string`  | Service name, e.g. `UserRepository` (required).        |
| `project`    | `string`  | Target project (required).                             |
| `directory`  | `string`  | Sub-directory under the project's source root (`lib`). |
| `skipFormat` | `boolean` | Skip formatting files after generation.                |

### `app` (alias `application`)

Generate a runnable Node application with an Effect entrypoint using
`NodeRuntime.runMain`. Composable logic lives in `src/app.ts`; the entrypoint is
`src/main.ts`.

```sh
nx g @rockware-ai/nx-effect:app my-app
nx serve my-app   # runs via tsx --watch
```

| Option       | Type      | Description                               |
| ------------ | --------- | ----------------------------------------- |
| `name`       | `string`  | Application name (required).              |
| `directory`  | `string`  | Directory relative to the workspace root. |
| `tags`       | `string`  | Comma-separated project tags.             |
| `skipFormat` | `boolean` | Skip formatting files after generation.   |

## License

MIT
