import { describe, expect, test } from 'vitest';

import { PGliteVector } from '.';

describe('PGliteVector rewriteDbUrl', () => {
  test('Maintains absolute file URLs', () => {
    const vector = new PGliteVector({ connectionUrl: 'file:/absolute/path/to/db.sqlite' });
    // @ts-ignore
    expect(vector.rewriteDbUrl('file:/absolute/path/to/db.sqlite')).toBe('file:/absolute/path/to/db.sqlite');
  });

  test('Does not modify non-file URLs', () => {
    const vector = new PGliteVector({ connectionUrl: 'http://example.com' });
    // @ts-ignore
    expect(vector.rewriteDbUrl('http://example.com')).toBe('http://example.com');
  });

  test('Does not modify in-memory database URL', () => {
    const vector = new PGliteVector({ connectionUrl: 'file::memory:' });
    // @ts-ignore
    expect(vector.rewriteDbUrl('file::memory:')).toBe('file::memory:');
  });

  // We cannot easily test the rewriting behavior that happens inside .mastra/output directory
  // as it depends on process.cwd() which we would need to mock
});
