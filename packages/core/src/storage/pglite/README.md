# PGlite Storage Driver for Mastra

This directory contains the PGlite storage driver implementation for Mastra. PGlite is a SQLite-compatible database that works in both Node.js and browser environments.

## Using with Next.js

The PGlite driver uses WebAssembly (WASM) files that are dynamically loaded at runtime. To make this work with Next.js, you'll need to configure your Next.js application to handle these WASM files correctly.

Add the following to your `next.config.js` file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    // Add support for WASM in @electric-sql/pglite
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Add WASM file loader
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    
    return config;
  },
};

module.exports = nextConfig;
```

This configuration enables async WebAssembly support in webpack and adds a loader for WASM files.