# @philiprehberger/ts-config-layer

[![CI](https://github.com/philiprehberger/ts-config-layer/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-config-layer/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/ts-config-layer.svg)](https://www.npmjs.com/package/@philiprehberger/ts-config-layer)
[![License](https://img.shields.io/github/license/philiprehberger/ts-config-layer)](LICENSE)

Layered configuration loader with typed output and multiple sources.

## Installation

```bash
npm install @philiprehberger/ts-config-layer
```

## Usage

```ts
import { loadConfig, envSource, objectSource } from '@philiprehberger/ts-config-layer';

const config = loadConfig({
  port: { type: 'number', default: 3000 },
  dbUrl: { type: 'string', required: true, env: 'DATABASE_URL' },
  debug: { type: 'boolean', default: false },
}, [
  envSource(),
  objectSource({ port: 8080 }),
]);

// config.port → 8080 (from objectSource, overrides default)
// config.dbUrl → from DATABASE_URL env var
// config.debug → false (default)
```

### Sources

Sources are applied in order — later sources override earlier ones:

```ts
const config = loadConfig(schema, [
  envSource(),                    // Load from process.env
  envSource('APP_'),              // Load from env vars with APP_ prefix
  objectSource({ port: 9090 }),   // Override with explicit values
]);
```

### Schema

```ts
const schema = {
  // Shorthand
  host: 'string',
  port: 'number',
  debug: 'boolean',

  // Full definition
  dbUrl: {
    type: 'string',
    required: true,     // Throws if missing (default: true)
    env: 'DATABASE_URL', // Map to specific env var name
    default: undefined,  // Default value if not provided
  },
};
```

## API

| Export | Description |
|--------|-------------|
| `loadConfig(schema, sources)` | Load and validate config from sources |
| `envSource(prefix?)` | Read from `process.env`, optionally filtering by prefix |
| `objectSource(obj)` | Read from a plain object |

### `ConfigFieldDef`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'string' \| 'number' \| 'boolean'` | — | Value type (auto-coerced) |
| `required` | `boolean` | `true` | Throw if missing |
| `default` | `string \| number \| boolean` | — | Default value |
| `env` | `string` | — | Override env var name |

## License

MIT
