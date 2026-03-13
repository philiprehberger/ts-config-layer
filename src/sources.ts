import type { ConfigSource } from './types.js';

export function envSource(prefix?: string): ConfigSource {
  return {
    name: 'env',
    load() {
      const env: Record<string, string | undefined> = {};
      try {
        if (typeof globalThis !== 'undefined' && 'process' in globalThis) {
          const proc = (globalThis as Record<string, unknown>).process as { env?: Record<string, string | undefined> };
          if (proc.env) {
            if (prefix) {
              const upper = prefix.toUpperCase();
              for (const [key, value] of Object.entries(proc.env)) {
                if (key.startsWith(upper)) {
                  const stripped = key.slice(upper.length).replace(/^_/, '');
                  env[stripped.toLowerCase()] = value;
                }
              }
            } else {
              for (const [key, value] of Object.entries(proc.env)) {
                env[key.toLowerCase()] = value;
              }
            }
          }
        }
      } catch { /* non-node environment */ }
      return env;
    },
  };
}

export function objectSource(obj: Record<string, unknown>): ConfigSource {
  return {
    name: 'object',
    load() {
      const result: Record<string, string | undefined> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null) {
          result[key.toLowerCase()] = String(value);
        }
      }
      return result;
    },
  };
}
