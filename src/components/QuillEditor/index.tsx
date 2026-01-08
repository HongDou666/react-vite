import ReactQuill, { type ReactQuillProps } from 'react-quill'

import { StyledEditor } from './styles'
import Toolbar, { formats } from './toolbar'

interface Props extends ReactQuillProps {
  sample?: boolean
}

export default function QuillEditor({ id = 'slash-quill', sample = false, ...other }: Props) {
  /* 自定义工具栏 */
  const modules = {
    toolbar: {
      container: `#${id}` // 指定工具栏的容器
    },
    history: {
      delay: 500, // 延迟500毫秒保存历史记录
      maxStack: 100, // 最大历史记录数
      userOnly: true // 用户操作才会保存历史记录
    },
    syntax: true, // 启用语法高亮 (需要引入highlight.js)
    // 启用剪贴板功能
    clipboard: {
      matchVisual: false // 不匹配视觉样式
    }
  }

  return (
    <StyledEditor>
      <Toolbar id={id} isSimple={sample} />
      <ReactQuill modules={modules} formats={formats} {...other} placeholder='Write something awesome...' />
    </StyledEditor>
  )
}
