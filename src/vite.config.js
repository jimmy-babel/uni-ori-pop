import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',  // 组件入口文件
      name: 'UniOriPopup',    // 全局变量名（UMD 模式）
      fileName: (format) => `uni-ori-popup.${format}.js`
    },
    rollupOptions: {
      // 外部化依赖（避免打包进库）
      external: ['vue', 'uni-app'],
      output: {
        globals: {
          vue: 'Vue',
          'uni-app': 'uniApp'
        }
      }
    }
  }
})