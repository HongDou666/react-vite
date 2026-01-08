import path from 'node:path'
import process from 'node:process'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import type { PluginOption } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function setupUnPluginIcon(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_LOCAL_PREFIX, VITE_ICON_PREFIX } = viteEnv

  const localIconPath = path.join(process.cwd(), 'src/assets/svg')

  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '') // local

  const plugins: PluginOption[] = [
    createSvgIconsPlugin({
      customDomId: '__SVG_ICON_LOCAL__',
      iconDirs: [localIconPath],
      inject: 'body-last',
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`
    }),

    /*
      unplugin-icons 图标组件配置
      参考文献1: https://blog.csdn.net/weixin_46872121/article/details/138212930
      参考文献2: https://juejin.cn/post/7095460309673967646
      参考文献3: https://blog.csdn.net/gitblog_00394/article/details/144346494
      参考文献4: https://blog.csdn.net/gitblog_00642/article/details/141151781
      参考文献5: https://www.dongaigc.com/p/unplugin/unplugin-icons
     */
    Icons({
      compiler: 'jsx', // 指定编译器
      defaultClass: 'inline-block', // 默认类名
      jsx: 'react', // 指定jsx运行时
      scale: 1, // 图标大小
      autoInstall: true, // 自动安装图标
      /* 自定义图标加载 */
      customCollections: {
        /* 这里的 key 值 对应auto-import.ts文件 customCollections: [collectionName] */
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      }
    })
  ]

  return plugins
}
