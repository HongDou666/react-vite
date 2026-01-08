/* FileSystemIconLoader 从 @iconify/utils/lib/loader/node-loaders 导入，用于从文件系统加载图标 */
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
/* presetIcons 从 @unocss/preset-icons 导入，提供了使用图标集合的预设配置 */
import presetIcons from '@unocss/preset-icons'
/* nocss 从 @unocss/vite 导入，是 UnoCSS 的 Vite 插件，用于在 Vite 项目中使用 UnoCSS */
import unocss from '@unocss/vite'
import path from 'node:path'
import process from 'node:process'

export function setupUnocss(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_LOCAL_PREFIX, VITE_ICON_PREFIX } = viteEnv

  /* 计算本地图标路径 */
  const localIconPath = path.join(process.cwd(), 'src/assets/svg')

  /* VITE_ICON_LOCAL_PREFIX: icon-local; VITE_ICON_PREFIX: icon */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '') // local

  /* UnoCSS 配置 */
  return unocss({
    presets: [
      /* 配置图标预设 */
      presetIcons({
        /* collections 对象定义了图标集合，其中键是之前计算出的 collectionName，值是通过 FileSystemIconLoader 加载的本地 SVG 图标。FileSystemIconLoader 接受一个路径和一个处理函数，处理函数用于修改每个 SVG 的内容（在这个例子中，给每个 <svg> 标签添加了 width="1em" 和 height="1em" 属性） */
        collections: {
          [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
            svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        /* extraProperties 对象定义了额外的 CSS 属性，这里给所有图标添加了 display: 'inline-block' */
        extraProperties: {
          display: 'inline-block'
        },
        /* prefix 定义了图标的 CSS 类名前缀 icon- */
        prefix: `${VITE_ICON_PREFIX}-`,
        /* scale 定义了图标的缩放比例 */
        scale: 1,
        /* warn 设置为 true，表示在加载图标时如果遇到问题会发出警告 */
        warn: true
      })
    ]
  })
}
