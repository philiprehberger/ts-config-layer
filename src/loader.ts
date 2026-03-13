import type { ConfigSchema, ConfigFieldDef, ConfigSource, ConfigValueType } from './types.js';

function normalizeField(field: ConfigFieldDef | ConfigValueType): ConfigFieldDef {
  if (typeof field === 'string') {
    return { type: field };
  }
  return field;
}

function coerce(value: string, type: ConfigValueType): string | number | boolean {
  switch (type) {
    case 'number': {
      const n = Number(value);
      if (isNaN(n)) throw new Error(`Cannot convert "${value}" to number`);
      return n;
    }
    case 'boolean':
      return value === 'true' || value === '1' || value === 'yes';
    case 'string':
    default:
      return value;
  }
}

export function loadConfig<T extends ConfigSchema>(
  schema: T,
  sources: ConfigSource[],
): { [K in keyof T]: T[K] extends { type: 'number' } | 'number' ? number : T[K] extends { type: 'boolean' } | 'boolean' ? boolean : string } {
  const merged: Record<string, string | undefined> = {};

  for (const source of sources) {
    const data = source.load();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        merged[key] = value;
      }
    }
  }

  const result: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const [key, rawField] of Object.entries(schema)) {
    const field = normalizeField(rawField);
    const envKey = field.env?.toLowerCase() ?? key.toLowerCase();
    const raw = merged[envKey] ?? merged[key.toLowerCase()];

    if (raw !== undefined) {
      try {
        result[key] = coerce(raw, field.type);
      } catch (e) {
        errors.push(`${key}: ${e instanceof Error ? e.message : String(e)}`);
      }
    } else if (field.default !== undefined) {
      result[key] = field.default;
    } else if (field.required !== false) {
      errors.push(`${key}: required but not provided`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Config validation failed:\n  ${errors.join('\n  ')}`);
  }

  return result as ReturnType<typeof loadConfig<T>>;
}
