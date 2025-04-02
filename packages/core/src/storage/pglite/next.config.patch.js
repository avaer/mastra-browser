/**
 * Next.js configuration patch for @electric-sql/pglite WASM support
 * Include this in your next.config.js
 * 
 * Usage:
 * ```js
 * const nextConfig = {
 *   webpack: (config, options) => {
 *     // Add support for WASM in @electric-sql/pglite
 *     config.experiments = {
 *       ...config.experiments,
 *       asyncWebAssembly: true,
 *     };
 *     
 *     // Add WASM file loader
 *     config.module.rules.push({
 *       test: /\.wasm$/,
 *       type: 'asset/resource',
 *     });
 *     
 *     return config;
 *   },
 * };
 * ```
 */