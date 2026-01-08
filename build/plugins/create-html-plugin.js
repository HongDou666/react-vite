/* 自动在index.html页面添加CDN依赖引入,打包后可在index.html查看效果（一般配合rollup-plugin-external-globals使用） */
import { createHtmlPlugin } from 'vite-plugin-html'
/* cdn外链引入 路径配置 */
let cdn = {
  css: [],
  js: [
    'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
    'https://unpkg.com/react-router-dom@6.28.1/dist/umd/react-router-dom.production.min.js',
    'https://unpkg.com/axios@1.7.7/dist/axios.min.js'
  ],
  moduleJs: []
}
export function setupCreateHtmlPlugin(isProduction) {
  return createHtmlPlugin({
    inject: {
      data: {
        /* 1. cdn外链引入配置（形式1）*/
        // reactscript: '<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>',
        // reactdomscript: '<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>',
        // reactrouterdomscript:
        //   '<script src="https://unpkg.com/react-router-dom@6.28.1/dist/umd/react-router-dom.production.min.js"></script>',
        // axiosscript: '<script src="https://unpkg.com/axios@1.7.7/dist/axios.min.js"></script>',
        /* 2. cdn外链引入配置（形式2）*/
        cdnCss: isProduction ? cdn.css : [],
        cdnJs: isProduction ? cdn.js : [],
        moduleJs: isProduction ? cdn.moduleJs : []
      }
    }
  })
}
