/* 自动导入包工具 pnpm install unplugin-auto-import */
import AutoImport from 'unplugin-auto-import/vite'
/* 实现自动引入 antd */
import AntdResolver from 'unplugin-auto-import-antd'
/* icon 自动引入解析器 自动导入图标 */
import IconsResolver from 'unplugin-icons/resolver'

export function setupAutoImport(viteEnv: Env.ImportMeta, path, pathSrc) {
  const { VITE_ICON_LOCAL_PREFIX, VITE_ICON_PREFIX } = viteEnv

  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '') // icon-local

  /* 配置自动导入 */
  return AutoImport({
    /* 自动导入包的名字 */
    imports: ['react', 'react-router-dom', 'ahooks'],
    /* 针对自己写的模块完成自动导入 */
    dirs: ['src/components/**'],
    /* 默认情况下，AutoImport 只处理 JavaScript 和 TypeScript 文件。通过设置 include 选项为包含 .tsx 的正则表达式，可以扩展它以包括其他类型的文件 */
    include: [/\.[tj]sx?$/],
    /* eslintrc 配置与 ESLint 相关的设置，目的是让自动导入（AutoImport）功能与 ESLint 更好地协同工作。它允许你在启用自动导入的同时，对 ESLint 进行定制化的配置，以确保代码质量和遵循特定的代码规范，并且处理自动导入可能引发的 ESLint 相关问题 */
    eslintrc: {
      enabled: true, // 开启eslint检测
      filepath: '../../.eslintrc-auto-import.json', // 配置文件路径
      globalsPropValue: true // 允许在模板中使用未声明的全局变量
    },
    /* 兼容ts不报错 默认情况下启用，如果安装了 `typescript` */
    dts: path.resolve(pathSrc, 'auto-imports.d.ts'), // './src/auto-imports.d.ts',
    /* 配置解析器，用以支持更多库的自动导入 */
    resolvers: [
      /*
        自动导入antd
        参考文献: https://juejin.cn/post/7301244391154024487#heading-2
      */
      AntdResolver({
        /* 使用自定义前缀，如 A, 书写组件的方式由原本的 Button 变为 AButton. 等价于 import { Button as AButton } from 'antd' */
        // prefix: 'A'
      }),

      /* 自动导入图标组件 */
      IconsResolver({
        /* 图标组件前缀，默认为 'Icon' */
        componentPrefix: VITE_ICON_PREFIX,
        /* 自动引入的Icon组件统一前缀 默认为icon 设置false为不需要前缀 这里配置成了 icon 即组件名以 icon 开头 */
        prefix: VITE_ICON_PREFIX,
        /* 自定义图标集合 */
        customCollections: [collectionName],
        /* 指定生成的组件文件扩展名，默认为 'tsx' */
        extension: 'tsx'
      })
    ]
  })
}
