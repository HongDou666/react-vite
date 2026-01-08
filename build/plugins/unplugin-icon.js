import path from 'node:path'
import process from 'node:process'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export function setupUnPluginIcon(viteEnv) {
  let _a
  let VITE_ICON_LOCAL_PREFIX = viteEnv.VITE_ICON_LOCAL_PREFIX,
    VITE_ICON_PREFIX = viteEnv.VITE_ICON_PREFIX
  let localIconPath = path.join(process.cwd(), 'src/assets/svg')
  let collectionName = VITE_ICON_LOCAL_PREFIX.replace(''.concat(VITE_ICON_PREFIX, '-'), '') // local
  let plugins = [
    createSvgIconsPlugin({
      customDomId: '__SVG_ICON_LOCAL__',
      iconDirs: [localIconPath],
      inject: 'body-last',
      symbolId: ''.concat(VITE_ICON_LOCAL_PREFIX, '-[dir]-[name]')
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
      compiler: 'jsx',
      defaultClass: 'inline-block',
      jsx: 'react',
      scale: 1,
      autoInstall: true,
      /* 自定义图标加载 */
      customCollections:
        ((_a = {}),
        /* 这里的 key 值 对应auto-import.ts文件 customCollections: [collectionName] */
        (_a[collectionName] = FileSystemIconLoader(localIconPath, function (svg) {
          return svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        })),
        _a)
    })
  ]
  return plugins
}
