import svg from '@neodx/svg/vite';
import typescript from '@rollup/plugin-typescript';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [
    typescript(),
    solid(),
    svg({
      inputRoot: 'src/shared/ui/icon/assets',
      fileName: '{name}.{hash:8}.svg',
      output: 'public/sprites',
      cleanup: 'auto',
      metadata: 'src/shared/ui/icon/sprite.gen.ts',
      resetColors: false,
    }),
    tailwindcss(),
  ],

  clearScreen: false,
  server: {
    port: 3000,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 3001,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@schema': path.resolve(__dirname, 'Dictionary/types.ts'),
    },
  },
}));
