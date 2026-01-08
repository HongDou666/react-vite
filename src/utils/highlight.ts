// highlight.js 导入名为 tomorrow-night 的暗色主题样式
import hljs from 'highlight.js'

import 'highlight.js/styles/base16/tomorrow-night.css'

hljs.configure({
  // 指定需要高亮的语言列表（减少不必要的语法解析，优化性能）
  languages: ['javascript', 'sh', 'bash', 'html', 'scss', 'css', 'json']
})

if (typeof window !== 'undefined') {
  window.hljs = hljs
}
