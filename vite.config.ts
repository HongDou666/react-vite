import { fileURLToPath } from 'node:url'
/* node的path模块; 前提: 需要安装node类型的包 @types/node */
import * as path from 'path'
import { resolve } from 'path'
/* 将指定的依赖无需打包进chunk中（该插件可以告诉 Rollup 哪些库是不需要打包的） */
import externalGlobals from 'rollup-plugin-external-globals'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'

/* 获取打包构建时间 */
import { getBuildTime } from './build/config'
/* 强制预构建的依赖项 */
import { include } from './build/optimize'
/* vite插件配置 */
import { createVitePlugins } from './build/plugins'

/* 判断字符串以什么结尾 */
function endsWith(str, searchString) {
  const str_ = str[0]
  if (!str_) return false
  const index = str_.length - searchString.length
  return index >= 0 && str_.indexOf(searchString, index) === index
}

/*
  配置哪些库无需参与打包
  参考文献:
  1. https://unpkg.com/
  2. https://juejin.cn/post/7165496600108728350
  3. https://juejin.cn/post/7235818900818526265#heading-7
  4. https://guohaonan1.github.io/2023/04/12/vite-vue3-ts%E6%90%AD%E5%BB%BA%E9%A1%B9%E7%9B%AE%E5%85%AB%EF%BC%88%E6%89%93%E5%8C%85%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B8%89%EF%BC%9A%E4%BD%BF%E7%94%A8CDN%EF%BC%89/#%E4%BD%BF%E7%94%A8rollup-plugin-external-globals%EF%BC%88%E6%8E%A8%E8%8D%90%EF%BC%89
  5. https://wingsnow.github.io/wingsnow-blog/code/vue/3-vite%E4%BD%BF%E7%94%A8cdn%E5%8A%A0%E8%BD%BD%E5%BA%93%E6%96%87%E4%BB%B6.html#%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE
*/
const externalGlobalsObj = externalGlobals({
  /*
  1. key : moment - 这里需要和external对应，这个字符串就是(import xxx from aaa)中的aaa，也就是包的名字
  2. value: antd - 这个是js文件导出的全局变量的名字，比如说vue就是Vue，ant-design-vue就是antd，查看源码或者参考作者文档可以获得
  （在源码中查找关键词）
    pinia => var Pinia
    vue => var Vue
    echarts => global.echarts = {}
    moment => global.moment =
    ant-design-vue => exports.antd=
    pdfjs-dist => var __webpack_exports__ = globalThis.pdfjsLib = {};
    sortablejs => (t=t||self).Sortable=e()
    mockjs2 => exports["Mock"] = factory(); | var Mock
    axios => globalThis:e||self).axios=t()
  */
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router-dom': 'ReactRouterDOM',
  axios: 'axios'
})

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  /* process.argv
  在终端通过 Node 执行命令的时候，通过 process.argv 可以获取传入的命令行参数，返回值是一个数组
      0: node的启动文件 （'C:\\Program Files\\nodejs\\node.exe',）
      1: 被执行的 JS 文件路径 （'E:\\桌面\\高级前端\\vue3\\vue3-vite\\vue3_vite\\node_modules\\vite\\bin\\vite.js'）
      2~n: 真实传入命令的参数 （终端运行 pnpm dev 那么结果就是 --mode 和 development）
  */

  /* process.env
  返回一个对象，存储当前环境相关的所有信息，用于获取当前环境的.env文件中的环境变量
    process.env.npm_lifecycle_event: 是一个 Node.js 中的环境变量，它包含当前正在执行的 npm 脚本的名称。这个变量通常用于在运行时确定正在执行的 npm 脚本，特别是在复杂的 npm 脚本配置中，或者当需要根据正在运行的脚本有条件地执行某些任务时非常有用。（终端运行pnpm dev 那么结果就是 dev ）
  */

  /* 返回当前 Node进程执行的目录，获取当前工作目录 */
  const root = process.cwd() // /Users/zhangqingchen/Desktop/前端Pro/React/react-vite

  /* 1. 获取src目录 */
  const pathSrc = path.resolve(__dirname, 'src') // /Users/zhangqingchen/Desktop/前端Pro/React/react-vite/src

  /* 2. 获取src目录 */
  const baseSrc = fileURLToPath(new URL('./src', import.meta.url)) // /Users/zhangqingchen/Desktop/前端Pro/React/react-vite/src

  /* 获取环境变量（直接从对应环境的.env.xxx文件获取） */
  const env = loadEnv(mode, root) as unknown as Env.ImportMeta

  /* 判断环境模式（本地开发 mode: development）（mode === import.meta.env.MODE）*/
  const isProduction = mode === 'production'

  /* 获取打包构建时间 */
  const buildTime = getBuildTime()

  return {
    /*
    主要用于在开发期间全局替换和内联环境变量或者其它变量
    定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换
      示例1 ：const STAGE = process.env.STAGE
      示例2 ：console.log(__MY_GLOBAL_WIN__) // 499
    */
    define: {
      'process.env': {
        _ISDEV_: isProduction
      },
      __APP_VERSION__: JSON.stringify('v1.0.0'),
      __MY_GLOBAL_WIN__: 'window.innerWidth'
    },
    /* 项目根目录 */
    root,
    /* 项目部署基础路径 './' */
    base: './',
    /* 无需处理的静态资源位置 */
    publicDir: fileURLToPath(new URL('./public', import.meta.url)),
    /* 需要处理的静态资源位置 */
    assetsInclude: fileURLToPath(new URL('./src/assets', import.meta.url)),
    /* vite插件使用 （Vite 支持 Rollup 插件; 这增加了构建过程中的灵活性和功能） */
    plugins: createVitePlugins(env, pathSrc, isProduction, buildTime),
    /* css配置 */
    css: {
      /* 主要用来配置css预处理器的一些全局参数 */
      preprocessorOptions: {
        /* scss 预处理 */
        scss: {
          /* 允许在 scss 文件中使用js表达式 */
          javascriptEnabled: true,
          /*
            引入 scss 全局变量文件
            参考文献1 : https://www.cnblogs.com/gogechang/p/18220614
            参考文献2 : https://www.cnblogs.com/hyt09/p/17628778.html
            additionalData: `@use "@/styles/theme/scss-theme.scss" as *;@use "@/styles/scss/global-auto-variable.scss" as *;`,
           */
          additionalData: `
          @use "${path.resolve(__dirname, 'src/styles/theme/scss-theme.scss')}" as *;
          @use "${path.resolve(__dirname, 'src/styles/scss/global-auto-variable.scss')}" as *;
          `,
          /* 设置scss的api类型为modern-compiler
           参考文献: https://blog.csdn.net/CssHero/article/details/142686148 */
          api: 'modern-compiler'
        }
      },
      /* 移动端适配 */
      postcss: {
        plugins: []
      }
    },
    /*
    打包，隐藏、去除 console debugger
      抖音链接: https://www.douyin.com/user/self?modal_id=7399572264997358886&showTab=record
      1.不借助插件参考下面做法（参考链接: https://blog.csdn.net/qq_39892965/article/details/136706444）
      2. 可以利用 terser 插件 （参考链接: https://blog.csdn.net/aexwx/article/details/134144784）
      3. 可以利用插件 vite-plugin-remove-console（参考链接: https://blog.csdn.net/weixin_47000834/article/details/136917529）
    */
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : []
    },
    /*
    打包结构控制
      打包性能调优 与 打包瘦身秘籍
      参考文献: https://blog.csdn.net/qq_41043186/article/details/137632024
    */
    build: {
      /* 主要用于生成一个打包资源清单文件 manifest.json，该文件会记录打包后各资源之间的映射关系 */
      manifest: true,
      /* 设置打包后文件的名称 */
      outDir: 'dist',
      /* 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录 */
      emptyOutDir: true,
      /* 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能 */
      reportCompressedSize: true,
      /* 关闭 sorcemap, 报错不会映射到源码; 如果开启映射,会将打包后的（.map文件）也部署到线上，线上如果有哪里报错，会直接映射到源码，方便找到错误的位置（此方式会将源代码对外暴露-不可采用）（一般会将打包后的.map文件部署到另一台服务器上，通过sourceMap文件中的一些方法进而还原线上出现的错误 & 错误文件源代码）*/
      sourcemap: false,
      /* 打包大小超出 400kb 提示警告 */
      chunkSizeWarningLimit: 400,
      /* 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项 (注意！！！: 不支持svg文件,需要手动处理,可查看 ComSvg/index.vue)
        采用默认值: 在项目中引入了较小的资源文件 import small from '@/assets/img/small.jpg', 开发环境打印是路径 /src/assets/img/small.jpg , 打包后生产环境打印是 base64 编码 (好处: 打包时不会单独生成一个文件; 避免额外的 http 请求)
        取消采用默认值设置为0: 开发环境打印是 /src/assets/img/small.jpg , 打包后生产环境打印也是路径 /src/assets/img/small.jpg
      */
      assetsInlineLimit: 4096,
      /* 代码打包压缩方式 boolean | 'terser' | 'esbuild'; 默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2% (当设置为 'terser' 时必须先安装 Terser, pnpm add -D terser)*/
      minify: 'esbuild',
      /* 打包配置 */
      rollupOptions: {
        /* 打包入口文件 根目录下的 index.html, 也就是项目从哪个文件开始打包 */
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url))
        },
        /* true: 打包开启日志（将会在每个文件发现的第一个副作用打印到控制台）*/
        experimentalLogSideEffects: false,
        /*
        该选项用于决定是否应用除屑优化（tree-shaking），并微调除屑优化的过程
          三个预设
          1. smallest：将所有模块的副作用都视为除屑，并尽可能地最小化输出。
          2. recommended: 对于大多数的使用模式来说，应该可以很好地工作（默认）（官方推荐）
          3. safest:试图在提供一些基本的除屑优化功能的同时，尽可能地符合规范
        */
        treeshake: {
          preset: 'recommended'
        },
        plugins: [
          /* 不参与打包依赖映射的对象 */
          // externalGlobalsObj
        ],
        /* cdn外链打包配置（优化点） */
        // external: Object.keys(externalGlobalsObj),
        /* 打包文件分类输出配置 */
        output: {
          /* 指定模块的输出格式为 ECMAScript 模块 */
          format: 'esm',
          /*
          打包: 配置入口的js的文件路径 （文件名称 => [文件名字].[hash值]）
          该选项用于指定 chunks 的入口文件名。默认值："[name].js"
            entryFileNames: 'js/[name]-[hash:6].js',（可以自定义hash值的长度）
          */
          entryFileNames: 'js/entry-[name]-[hash].js',
          /*
          该选项用于对代码分割中产生的 chunk 文件自定义命名。默认值："[name]-[hash].js"
          chunkFileNames: 'js/[name]-[hash].js',
          */
          chunkFileNames: 'js/chunk-[name]-[hash].js',
          /*
          assetFileNames 该选项用于自定义构建结果中的静态文件名称。默认值："assets/[name]-[hash][extname]"
            [extname]：包含点的静态文件扩展名，例如：.css
            [ext]：不包含点的文件扩展名，例如：css
            '[ext]/[name]-[hash].[ext]' => 不同的文件名后缀放到不同的文件下
          */
          // 1. assetFileNames: '[ext]/[name]-[hash].[ext]',
          // 2. assetFileNames: '[ext]/[name]-[hash][extname]'
          /* 使用函数的形式 */
          assetFileNames(assetInfo) {
            if (assetInfo.names && assetInfo.names.length) {
              // 如果是以css结尾的文件，则打包到css文件夹下
              if (endsWith(assetInfo.names, 'css')) {
                return 'css/[name]-[hash].[ext]'
              }
              // 如果是以svg结尾的文件，则打包到svg文件夹下
              if (endsWith(assetInfo.names, 'svg')) {
                return 'svg/[name]-[hash].[ext]'
              }
              // 如果是以图片结尾的文件，则打包到img文件夹下
              if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].some((ext) => endsWith(assetInfo.names, ext))) {
                return 'imgs/[name]-[hash].[ext]'
              }
            }
            // 如果是其他文件，则打包到assets文件夹下
            return 'assets/[name]-[hash].[ext]'
          },
          /*
          小于20kb就会单独打包成一个文件（chunk合并）(前提是 vite里面对应的rollup要大于3.3版本，否则无效-升级vite) （仅当合并不会改变任何入口加载时执行的副作用时，才会执行合并）（如果小于20kb没有chunk合并 就是当前这个chunk有副作用 具体可结合experimentalLogSideEffects 查看）
          */
          experimentalMinChunkSize: 20 * 1024, // 打包优化点（减少chunk数量）

          /* 1. 手动分包(对象形式) */
          /*
          将第三方包单独打包到一个文件（将 vue vue-router 打包的文件名为vue）
          如果想把项目中所有的第三方依赖 打包都配置，需要一个一个手动添加（显然很麻烦）
           manualChunks: {
              "vendor-core": ["react", "react-dom", "react-router"],
              "vendor-ui": ["antd", "@ant-design/icons", "@ant-design/cssinjs", "framer-motion", "styled-components"],
              "vendor-utils": ["axios", "dayjs", "i18next", "zustand", "@iconify/react"],
              "vendor-charts": ["apexcharts", "react-apexcharts"],
              'group-user': [
                './src/views/VueFileFormat/index.vue',
                './src/views/VueCodemirror/index.vue',
                './src/views/CanvasDemo/index.vue',
              ]
            }
          */

          /* 2. 手动分包(函数形式) */
          manualChunks(id) {
            /* 优化点：把业务模块 Dashboard 和 Echarts 打进一个chunk（其他处理办法：用插件vite-plugin-webpackchunkname可以在路由中直接配置打包chunk） */
            if (id.includes('src/views/Dashboard') || id.includes('src/views/Echarts')) {
              return 'business-module'
            }
            /* 优化点：react-quill 只有极少数页面使用 所以单独打一个包 */
            if (id.includes('react-quill')) {
              return 'react-quill'
            }
            /* 将 monaco-editor 单独打包为一个 chunk */
            if (id.includes('monaco-editor')) {
              return 'monaco'
            }
            /* 优化点：打包时将大多数第三方依赖打到一个ventor-zqc.js文件中 */
            if (id.includes('node_modules')) {
              return 'ventor-zqc'
              /*
                1. （如果项目中第三方依赖过多 打出包的ventor-zqc文件可能会比较大，此时可以考虑将一部分第三方库采用外链cdn的形式引入，提高打包速度）
                2. 将大部分第三方库统一打包到ventor-zqc 会导致打包上线后所有的页面刷新都会加载大部分第三方库的资源，此时可以考虑将某些耗费资源大的第三方库以懒加载的形式进行引入（在需要的时候再加载相应的第三方库，避免了一次性加载所有的库）
              */
            }

            /* 将 views 文件夹下的每一个文件模块都单独打成一个 chunk 包 */
            if (id.includes('/views/')) {
              const moduleName = id.split('/views/')[1].split('/')[0]
              return 'views-' + moduleName
            }

            /*
              非第三方依赖（业务模块）都统一打包到index文件中（包括js css等）
              return 'index'
            */

            /*
              加 return 'index'
                产生问题：此时按照上述配置（return 'index'）打包会产出四个文件，分别是ventor-zqc 和 index 和 react-quill 和 business-module，会极大的减少chunk的数量；但同时，会引入一个新的问题: 所有的业务资源模块打到index文件会导致不能最大限度的利用浏览器缓存，进而初始加载页面白屏时间长；

              不加 return 'index'
                产生问题：会产出很多chunk文件（会导致资源加载时间更长-页面白屏时间长），有的chunk文件非常小，甚至不到1kb,
                解决方案： experimentalMinChunkSize
            */
          }

          /*
            format: 'esm', 指定模块的输出格式为 ECMAScript 模块
            chunkFileNames: 'static/js/[name]-[hash].js',
            entryFileNames: 'static/js/[name]-[hash].js',
            assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
          */
        }
      }
    },
    /*
      依赖于构建配置 (Vite首次启动慢的问题)
      参考文献: https://blog.csdn.net/weixin_43245095/article/details/125975251
      参考文献: https://blog.csdn.net/pzy_666/article/details/123017630
      参考文献: https://www.cnblogs.com/hetaojs/p/15386371.html
      参考文献: https://blog.csdn.net/qq_51368103/article/details/132073786
     */
    optimizeDeps: {
      /* 强制预构建的依赖项 */
      include: include
      /* 启动项目前会预构建的入口 */
      // entries:[],
      /* 在预构建中强制排除的依赖项 */
      // exclude: [],
    },
    /* 路径配置 */
    resolve: {
      /*
        alias: {
          '@': resolve(__dirname, './src'),
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
      */
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src')
          // 1. replacement: resolve(__dirname, './src')
          // 2. replacement: '/src/'
          // 3. replacement: baseSrc
          // 4. replacement: path.resolve(__dirname, './src')
        },
        {
          find: /^~@\//,
          // find: '~@',
          replacement: '/src/'
        },
        {
          find: '~',
          replacement: baseSrc
        }
      ]
    },
    /* 代理跨域 */
    server: {
      host: '0.0.0.0', // 启用本地ip
      port: 6012, // 端口号
      open: true, // 自动打开浏览器
      proxy: {
        /* 代理跨域 (本地服务器) */
        '/api/demo': {
          // 获取数据的服务器地址设置
          target: 'http://localhost:6000',
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api\/demo/, '')
        },
        /* 代理跨域 (本地服务器-文件上传) */
        '/api/upload': {
          target: 'http://localhost:5500',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/upload/, '/upload')
        },
        /* 代理跨域(外地服务器-文件下载 Video) */
        '/api/downloadVideo': {
          target: 'https://www.runoob.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/downloadVideo/, '')
        },
        /* 代理跨域(外地服务器-文件下载pdf-1) */
        '/api/downloadPdf': {
          target: 'http://storage.xuetangx.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/downloadPdf/, '')
        },
        /* 代理跨域(外地服务器-文件下载pdf-2) */
        '/api/download': {
          target: 'http://101.34.220.192:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/download/, '')
        },
        /* 代理跨域(外地服务器-图片下载) */
        '/api/images': {
          target: 'https://fetch-progress.anthum.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/images/, '')
        },
        /* 代理跨域(外地服务器-卖座电影列表) */
        '/api/maizuo': {
          target: 'https://m.maizuo.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/maizuo/, '')
        },
        /* 代理跨域 (本地服务器 Apifox) */
        // 1. '/api': {
        // 2. [env.VITE_APP_BASE_API]: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器地址设置
          target: 'https://apifoxmock.com/m1/5717422-5399331-default',
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    }
  }
})
