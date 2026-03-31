# @philiprehberger/config-layer

[![CI](https://github.com/philiprehberger/config-layer/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/config-layer/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/config-layer.svg)](https://www.npmjs.com/package/@philiprehberger/config-layer)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/config-layer)](https://github.com/philiprehberger/config-layer/commits/main)

Layered configuration loader with typed output and multiple sources

## Installation

```bash
npm install @philiprehberger/config-layer
```

## Usage

```ts
import { loadConfig, envSource, objectSource } from '@philiprehberger/config-layer';

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

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/config-layer)

🐛 [Report issues](https://github.com/philiprehberger/config-layer/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/config-layer/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
