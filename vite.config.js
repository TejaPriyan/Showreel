import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Two build modes:
//  - `npm run dev` / normal `npm run build`  -> standard multi-file Vite app
//  - `npm run build -- --mode singlefile`    -> inlines everything into one
//    self-contained dist/index.html (handy for sharing a single preview file
//    or dropping into an <iframe>/webview with zero server config).
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'singlefile' ? [viteSingleFile()] : []),
  ],
  build: {
    target: 'es2019',
    cssCodeSplit: mode !== 'singlefile',
    assetsInlineLimit: mode === 'singlefile' ? 100000000 : 4096,
  },
}));
