import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: './src/extension.ts',
      formats: ['cjs'],
      fileName: 'extension',
    },
    rollupOptions: {
      external: ['vscode', 'fs', 'path', 'os'],
    },
    sourcemap: true,
    outDir: 'dist',
  },
});
