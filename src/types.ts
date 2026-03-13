export type ConfigValueType = 'string' | 'number' | 'boolean';

export interface ConfigFieldDef {
  type: ConfigValueType;
  required?: boolean;
  default?: string | number | boolean;
  env?: string;
}

export type ConfigSchema = Record<string, ConfigFieldDef | ConfigValueType>;

export type InferConfig<T extends ConfigSchema> = {
  [K in keyof T]: T[K] extends 'string' ? string
    : T[K] extends 'number' ? number
    : T[K] extends 'boolean' ? boolean
    : T[K] extends { type: 'string' } ? string
    : T[K] extends { type: 'number' } ? number
    : T[K] extends { type: 'boolean' } ? boolean
    : never;
};

export interface ConfigSource {
  name: string;
  load(): Record<string, string | undefined>;
}
