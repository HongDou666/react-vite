module.exports = {
  /* 继承推荐规范配置 */
  extends: [
    /* 配置stylelint拓展插件 */
    'stylelint-config-standard',
    /* 配置stylelint和prettier兼容 */
    'stylelint-config-prettier',
    /* 进一步推荐的针对 SCSS 的规则配置，聚焦于优化 SCSS 样式代码的质量和风格 */
    'stylelint-config-recommended-scss'
  ],
  /* 添加规则插件 */
  plugins: ['stylelint-order'],
  /* 不同格式的文件指定自定义语法 */
  overrides: [
    {
      files: ['**/*.{css|scss}'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.(html)'],
      customSyntax: 'postcss-html'
    }
  ],
  /* 忽略检测文件 */
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md', '**/*.yaml'],
  /* 自定义配置规则 */
  rules: {
    'value-keyword-case': null, // 在 css 中使用 v-bind，不报错
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'function-url-quotes': 'always', // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    'no-empty-source': null, // 关闭禁止空源码
    'selector-class-pattern': null, // 关闭强制选择器类名的格式 | 指定类选择器的模式
    'selector-id-pattern': null, // 关闭强制选择器 id 的格式 | 指定 id 选择器的模式
    'property-no-unknown': null, // 禁止未知的属性(true 为不允许) | 便于配置变量 关闭未知属性检测
    'value-no-vendor-prefix': null, // 关闭 属性值前缀 --webkit-box
    'property-no-vendor-prefix': null, // 关闭 属性前缀 -webkit-mask |  // 允许对应内核前缀
    'custom-property-pattern': null, // 关闭 自定义属性名校验 --custom-property
    'declaration-block-no-redundant-longhand-properties': null, // 关闭 禁止冗余的属性声明
    'font-family-no-duplicate-names': null,
    'no-duplicate-selectors': null,
    'import-notation': null, // 关闭引入路径格式的自动转换 @import 'xxx' -> @import url('xxx')
    'scss/no-global-function-names': null, // 关闭全局函数命名
    'scss/at-extend-no-missing-placeholder': null, // 关闭扩展选择器
    'font-family-no-missing-generic-family-keyword': null, // 关闭缺少通用字体的提示
    'selector-pseudo-class-no-unknown': [
      true,
      {
        /* global 样式穿透; export scss模块化暴露 */
        ignorePseudoClasses: ['global', 'export']
      }
    ],
    // 指定样式的排序 修复后会帮我们自动整理CSS样式的顺序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'margin-collapse',
      'margin-top-collapse',
      'margin-right-collapse',
      'margin-bottom-collapse',
      'margin-left-collapse',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
      'font',
      'font-family',
      'font-size',
      'font-smoothing',
      'osx-font-smoothing',
      'font-style',
      'font-weight',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'color',
      'text-align',
      'text-decoration',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-size-adjust',
      'text-shadow',
      'text-transform',
      'word-break',
      'word-wrap',
      'white-space',
      'vertical-align',
      'list-style',
      'list-style-type',
      'list-style-position',
      'list-style-image',
      'pointer-events',
      'cursor',
      'background',
      'background-color',
      'border',
      'border-radius',
      'content',
      'outline',
      'outline-offset',
      'opacity',
      'filter',
      'visibility',
      'size',
      'transform'
    ]
  }
}
