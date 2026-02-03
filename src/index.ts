import type { Plugin } from 'vite'

import { createRequire } from 'node:module'
import stdLibBrowser from 'node-stdlib-browser'

const require = createRequire(import.meta.url)

export const rolldownInject: Record<string, string> = {
  Buffer: require.resolve('vite-plugin-node-polyfills/shims/buffer'),
  global: require.resolve('vite-plugin-node-polyfills/shims/global'),
  process: require.resolve('vite-plugin-node-polyfills/shims/process'),
}

function getModuleName(name: string) {
  const unprefixed = name.replace(/^node:/, '')
  if (unprefixed === 'buffer') return 'Buffer'
  return unprefixed
}

export const alias = Object.entries(stdLibBrowser).reduce(
  (map, [name, value]) => {
    map[name] = rolldownInject[getModuleName(name)] || value
    return map
  }, {} as Record<string, string>
)

export const define = {
  Buffer: 'Buffer',
  global: 'global',
  process: 'process',
}

export const oxcInject: Record<string, [string, string]> = {
  Buffer: ['vite-plugin-node-polyfills/shims/buffer', 'default'],
  global: ['vite-plugin-node-polyfills/shims/global', 'default'],
  process: ['vite-plugin-node-polyfills/shims/process', 'default']
}

export const banner = [
  `import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'`,
  `import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'`,
  `import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'`,
  `globalThis.Buffer = globalThis.Buffer || __buffer_polyfill`,
  `globalThis.global = globalThis.global || __global_polyfill`,
  `globalThis.process = globalThis.process || __process_polyfill`,
  ``,
].join('\n')

export const stdlib = (): Plugin => {
  return {
    name: 'vite-plugin-stdlib',
    config() {
      return {
        resolve: { alias },
        oxc: {
          inject: oxcInject,
        },
        optimizeDeps: {
          include: Object.values(oxcInject).map(([moduleName]) => moduleName),
          rolldownOptions: {
            resolve: { alias },
            transform: { define },
            plugins: [
              {
                name: 'vite-plugin-stdlib:optimizer',
                banner,
              },
            ],
          },
        },
        build: {
          rolldownOptions: {
            transform: { inject: rolldownInject },
          },
        },
      }
    },
  }
}
