import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        buffer: './src/buffer.ts',
        process: './src/process.ts',
        global: './src/global.ts',
      },
    },
    minify: false,
    rollupOptions: {
      external: [/^node:.*$/],
      output: [
        {
          esModule: true,
          exports: 'named',
          format: 'es',
        },
      ],
    },
    outDir: 'injects',
  },
})
