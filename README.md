# nx-plugins

A monorepo of [Nx](https://nx.dev) plugins, built and released with Nx itself.

| Package                                                  | Description                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`@rafarochas91/nx-effect`](./packages/nx-effect)        | Generators for [Effect](https://effect.website) libraries, services/layers and apps.        |
| [`@rafarochas91/nx-varlock`](./packages/nx-varlock)      | Generator, executors and inferred targets for [Varlock](https://varlock.dev) env management. |

## Development

This is an [Nx](https://nx.dev) workspace using [pnpm](https://pnpm.io).

```sh
pnpm install

# Build a plugin
nx build nx-effect

# Test everything
nx run-many -t test lint build

# Try a generator without writing to disk
nx g @rafarochas91/nx-effect:library demo --dry-run
```

### Project layout

```
packages/
  nx-effect/    # @rafarochas91/nx-effect
  nx-varlock/   # @rafarochas91/nx-varlock
```

## Releasing

Versioning and publishing are handled by [Nx Release](https://nx.dev/features/manage-releases).

```sh
# Cut a version, update changelogs and create git tags (dry run first!)
nx release --dry-run

# Publish the built packages to npm
nx release publish
```

Both packages publish under the `@rafarochas91` scope with public access. After
the first publish, list them on the
[Nx plugin registry](https://nx.dev/extending-nx/registry) by adding the
`nx-plugin` keyword (already set) and submitting the package.

## License

MIT
