/* 引入react插件 */
import react from '@vitejs/plugin-react'
/* 引入fs模块 (文件系统模块) */
import fs from 'fs'
/* 引入path模块 */
import * as path from 'path'
/* 打包文件可视化 */
import { visualizer } from 'rollup-plugin-visualizer'
/* 引入vite带有的ts配置文件 */
import type { PluginOption } from 'vite'
/* 可以让开发者在浏览器端就可以看到文件编译后的代码、文件的相互依赖关系 Inspect() */
// import Inspect from 'vite-plugin-inspect'
/* 生产环境删除所有指定console类型的vite插件 */
import removeConsole from 'vite-plugin-remove-console'
/* 静态资源拷贝 */
import { viteStaticCopy } from 'vite-plugin-static-copy'
/* 引入svgr插件 允许将 SVG 文件作为 React 组件导入 */
import svgr from 'vite-plugin-svgr'

import { setupAutoImport } from './auto-import'
import { setupCreateHtmlPlugin } from './create-html-plugin'
import { setupHtmlPlugin } from './html'
import { setupMockServerPlugin } from './mock-server'
import { setupPrefetchLazyPlugin } from './prefetch-lazy-plugin'
import { setupUnPluginIcon } from './unplugin-icon'

import { setupUnocss } from './unocss'

export function createVitePlugins(viteEnv: Env.ImportMeta, pathSrc: string, isProduction: boolean, buildTime: string) {
  const vitePluginList: (PluginOption | PluginOption[])[] = [
    react(),

    /* 静态资源拷贝 */
    viteStaticCopy({
      /*
        专门用于解决 Monaco Editor 在打包后找不到 Web Worker 文件的问题:
        1. ​复制所有 Worker 文件​​
          通过通配符匹配 Monaco Editor 的所有 Web Worker 文件（包括 .js 和 .js.map）。
        2. ​​保持目录结构​​
          将文件复制到构建输出目录（通常是 dist）下的 vs 子目录中，保持与 Monaco 预期的路径一致。
        ​3. ​生产环境必备​​
          开发时 Vite 服务器可以直接访问 node_modules，但生产构建后需要这些文件被复制到最终输出目录
      */
      targets: [
        {
          src: 'node_modules/monaco-editor/esm/vs/**/*.worker.*', // 源文件路径
          dest: 'vs' // 打包后文件存放的目录(目标目录)
        }
      ]
    }),

    /* 配置自动导入 */
    setupAutoImport(viteEnv, path, pathSrc),

    /* 配置unocss */
    setupUnocss(viteEnv),

    /* vite-plugin-svg-icons 配置 */
    setupUnPluginIcon(viteEnv),

    /* 第三方依赖以外链cdn形式在index.html自动引入 */
    setupCreateHtmlPlugin(isProduction),

    /* 打包视图 */
    visualizer({
      gzipSize: true, // 搜集gzip压缩包的大小到图表
      brotliSize: true, // 搜集brotli压缩包的大小到图表
      emitFile: false, // 使用emitFile生成文件，为true时，打包后的分析文件会出现在打包好的文件包下，否则就会在项目目录下
      filename: 'vite-build.html', //分析图生成的文件名
      open: true //如果存在本地服务端口，将在打包后自动展示
    }),

    /* 注册 vite-plugin-svgr */
    svgr(),

    /* 生产环境删除所有指定console类型 */
    removeConsole(),

    /* 向打包后的index.html文件中注入时间戳 */
    setupHtmlPlugin(buildTime),

    /* 网络请求数据模拟 mockjs */
    setupMockServerPlugin(),

    /* 为打包后生成的html文件中link标签 自动加入 rel="prefetch" 预加载 */
    setupPrefetchLazyPlugin(path, fs)
  ]

  return vitePluginList
}
