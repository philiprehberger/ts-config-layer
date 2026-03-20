import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');

describe('config-layer', () => {
  it('should export loadConfig', () => {
    assert.ok(mod.loadConfig);
  });

  it('should export envSource', () => {
    assert.ok(mod.envSource);
  });

  it('should export objectSource', () => {
    assert.ok(mod.objectSource);
  });
});
