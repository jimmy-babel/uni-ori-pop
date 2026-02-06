import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
   plugins: [
    vue(),
    cssInjectedByJsPlugin(),
  ],
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
    },
    // 确保样式被正确提取/内联
    cssCodeSplit: false,
    sourcemap: false,
  }
})

// uni-ori-popup/vite.config.js
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'path'

// // 解决__dirname在ES模块中的兼容问题（Vite默认是ES模块）
// const __dirname = path.resolve()

// export default defineConfig({
//   // 必须启用Vue插件，否则无法打包.vue文件
//   plugins: [vue()],
//   build: {
//     // 明确指定构建模式为「库模式」（核心！）
//     lib: {
//       // 入口文件：指向src/index.js（组件导出入口）
//       // 用path.resolve确保路径绝对正确，避免相对路径坑
//       entry: path.resolve(__dirname, 'src/index.js'),
//       // 库的全局变量名（非必须，但建议加）
//       name: 'UniOriPopup',
//       // 输出的文件名（对应package.json的main/module）
//       fileName: (format) => `uni-ori-popup.${format}.js`
//     },
//     rollupOptions: {
//       // 排除Vue和UniApp（让用户项目提供，避免打包重复依赖）
//       external: ['vue', '@dcloudio/uni-app'],
//       output: {
//         // 全局变量映射（供UMD模式使用）
//         globals: {
//           vue: 'Vue',
//           '@dcloudio/uni-app': 'uni'
//         }
//       }
//     },
//     // 禁用CSS分离（UniApp组件CSS建议内联）
//     cssCodeSplit: false
//   }
// })