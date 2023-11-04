import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import VitePluginCompression from 'vite-plugin-compression'
import {viteCommonjs} from "@originjs/vite-plugin-commonjs";


export default defineConfig({
  base:'/p/',
  server:{
    host:'127.0.0.1',
    port:3000
  },
  plugins: [vue(),
    VitePluginCompression({
      threshold:10240
    }),
    viteCommonjs()
  ],
  define:{
    'process.env':{},
    global: 'globalThis',

  },
  root: './src/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsDir: '../assets',
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      // plugins: [nodePolyfills()],
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
    //     mobile: path.resolve(__dirname, 'src/mobile.html'),
    //     admin: path.resolve(__dirname, 'src/admin.html'),
    //     board: path.resolve(__dirname, 'src/board.html'),
      }, output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },

})