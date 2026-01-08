/* 从@unocss/preset-uno包中导入Theme类型 */
import type { Theme } from '@unocss/preset-uno'
/* 导入UnoCSS的Uno预设，它包含了一套默认的原子类 */
import presetUno from '@unocss/preset-uno'
/* 导入两个转换器，用于处理特殊的类名规则 */
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
/* 从@unocss/vite包中导入defineConfig函数，用于定义UnoCSS的配置 */
import { defineConfig } from '@unocss/vite'

/* 从本地文件导入一个自定义预设，可能包含了一些特定的样式规则或快捷方式 */
import { presetSoybeanAdmin, themeVars } from './uno-preset'

export default defineConfig<Theme>({
  content: {
    /* 指定要扫描的文件，这里是整个项目 */
    pipeline: {
      /* 排除某些目录，例如 node_modules 和 dist 文件夹 */
      exclude: ['node_modules', 'dist']
    }
  },
  /* 应用一系列的预设。这里应用了Uno预设（启用了暗色模式类名前缀为class）和自定义的presetSoybeanAdmin预设 */
  presets: [presetUno({ dark: 'class' }), presetSoybeanAdmin()],
  /*
    自定义规则，用于生成特定的类名
    定义自定义的规则。这里定义了一个规则，用于匹配形如h-calc(...)的类名，并将其转换为一个height属性，使用calc()函数计算值
  */
  rules: [
    [
      /^h-calc\((.*)\)$/, // 匹配 h-clac(xxx) 的正则表达式
      ([, d]) => ({ height: `calc(${d})px` }) // 生成对应的 CSS 样式
    ],
    [
      /^zqc-(.*)$/,
      ([, c], { theme }: any) => {
        return {
          color: c,
          'font-size': theme.fontSize['icon-large']
        }
      }
    ]
  ],
  /* shortcuts：定义快捷方式。这里定义了一个card-wrapper快捷方式，它等价于rd-8px shadow-sm这两个类名的组合 */
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm'
  },
  /* 自定义主题变量。这里定义了不同大小的图标字体大小 */
  theme: {
    ...themeVars,
    fontSize: {
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-small': '1rem',
      'icon-xl': '2rem',
      'icon-xs': '0.875rem'
    }
  },
  /* 应用转换器。这里应用了transformerDirectives和transformerVariantGroup两个转换器，用于处理特殊的类名规则 */
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
