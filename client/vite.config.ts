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

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
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
      // 3. tell Vite to ignore watching `src-tauri`
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
