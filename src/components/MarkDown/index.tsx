// 使用 ReactMarkdown 组件将输入的 Markdown 文本转换为 React 元素
import ReactMarkdown, { type Options } from 'react-markdown'
// 语法高亮
import rehypeHighlight from 'rehype-highlight'
// 支持html标签 允许渲染原始 HTML
import rehypeRaw from 'rehype-raw'
// GitHub 风格 Markdown 扩展 (直接添加对划线、表格、任务列表和url的支持)
import remarkGfm from 'remark-gfm'

import StyledMarkdown from './styles'

import '@/utils/highlight'

type Props = Options

export default function MarkDown({ children }: Props) {
  return (
    <StyledMarkdown>
      <ReactMarkdown
        rehypePlugins={[
          rehypeHighlight, // 为代码块添加语法高亮 依赖 highlight.js
          rehypeRaw // 允许 Markdown 中嵌入 HTML（如 <div>...</div>）
        ]}
        remarkPlugins={[
          [
            remarkGfm, // 支持 GitHub 风格的 Markdown（表格、任务列表、删除线等）
            { singleTilde: false } // 禁用单波浪线作为删除线（需用双波浪线 ~~）
          ]
        ]}>
        {children}
      </ReactMarkdown>
    </StyledMarkdown>
  )
}
