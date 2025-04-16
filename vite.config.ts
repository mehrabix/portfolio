import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild }) => {
  // Base configuration for both client and SSR builds
  const baseConfig = {
    plugins: [react()],
    base: '/', // Standard root path
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }

  // For SSR build
  if (isSsrBuild) {
    return {
      ...baseConfig,
      build: {
        ssr: true,
        outDir: 'dist/server',
        rollupOptions: {
          input: resolve(__dirname, 'src/entry-server.tsx'),
          output: {
            format: 'esm'
          }
        }
      },
      ssr: {
        noExternal: ['react-helmet', '@emotion/styled', 'framer-motion']
      }
    }
  }

  // For client build
  return {
    ...baseConfig,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    }
  }
})
