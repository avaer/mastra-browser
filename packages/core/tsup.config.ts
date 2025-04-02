import babel from '@babel/core';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

import treeshakeDecoratorsBabelPlugin from './tools/treeshake-decorators';

type Plugin = NonNullable<Options['plugins']>[number];

let treeshakeDecorators = {
  name: 'treeshake-decorators',
  renderChunk(code, info) {
    if (!code.includes('__decoratorStart')) {
      return null;
    }

    return new Promise((resolve, reject) => {
      babel.transform(
        code,
        {
          babelrc: false,
          configFile: false,
          filename: info.path,
          plugins: [treeshakeDecoratorsBabelPlugin],
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve({
            code: result!.code!,
            map: result!.map!,
          });
        },
      );
    });
  },
} satisfies Plugin;

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/base.ts',
    'src/utils.ts',
    '!src/action/index.ts',
    'src/*/index.ts',
    'src/storage/libsql/index.ts',
    'src/storage/pglite/index.ts',
    'src/vector/libsql/index.ts',
    'src/vector/filter/index.ts',
    'src/telemetry/otel-vendor.ts',
  ],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  splitting: true,
  treeshake: {
    preset: 'smallest',
  },
  plugins: [treeshakeDecorators],
  loader: {
    '.wasm': 'file',
    '.data': 'file',
  },
  esbuildOptions(options) {
    // Enable WebAssembly
    options.supported = {
      ...options.supported,
      'dynamic-import': true,
      'import-meta': true,
    };
  },
  // Enable WebAssembly for the build
  target: ['es2020'],
  sourcemap: true,
  keepNames: true,
  external: [],
  // Copy PGlite assets to the dist folders
  async onSuccess() {
    const fs = await import('fs');
    const path = await import('path');
    
    // Source file paths
    const sourceFiles = [
      './node_modules/@electric-sql/pglite/dist/postgres.wasm',
      './node_modules/@electric-sql/pglite/dist/postgres.data'
    ];
    
    // Directories to copy to
    const targetDirs = [
      './dist',                     // Root dist folder
      // './dist/storage',             // Storage folder
      // './dist/storage/pglite',      // PGlite implementation folder
    ];
    
    // Create directories if needed
    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    
    // Copy each file to all directories
    for (const sourceFile of sourceFiles) {
      if (!fs.existsSync(sourceFile)) {
        console.warn(`File not found at expected location: ${sourceFile}`);
        continue;
      }
      
      const fileName = path.basename(sourceFile);
      
      for (const dir of targetDirs) {
        const targetPath = path.join(dir, fileName);
        fs.copyFileSync(sourceFile, targetPath);
        console.log(`Copied ${fileName} to ${targetPath}`);
      }
    }
    
    console.log('✅ PGlite assets copied to all required directories');
  },
});
