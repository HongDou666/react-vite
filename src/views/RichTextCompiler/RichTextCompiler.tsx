import type { TabsProps } from 'antd'

import DraftWysiwyg from './modules/DraftWysiwyg'
import ReactQuillComp from './modules/ReactQuillComp'
import ReactQuillEdit from './modules/ReactQuillEdit'

import '@/utils/highlight'

const RichTextCompiler: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1')
  const [tabList] = useState<TabsProps['items']>([
    {
      key: '1',
      label: 'react-draft-wysiwyg',
      children: <DraftWysiwyg></DraftWysiwyg>
    },
    {
      key: '2',
      label: 'react-quill',
      children: <ReactQuillEdit></ReactQuillEdit>
    },
    {
      key: '3',
      label: 'react-quill 组件封装',
      children: <ReactQuillComp></ReactQuillComp>
    }
    /*
      @toast-ui/react-editor (pnpm install @toast-ui/react-editor)
        Toast UI Editor 是一个功能丰富的 Markdown 编辑器，由 NHN 开发并维护。它提供了所见即所得（WYSIWYG）和 Markdown 两种编辑模式，并且具有高度的可定制性。Toast UI Editor 不仅支持常见的 Markdown 语法，还支持表格、图表、代码块高亮等扩展功能。

        @toast-ui/react-editor 是 Toast UI Editor 的 React 版本，它使得在 React 项目中集成 Toast UI Editor 变得非常简单
    */
  ])

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        items={tabList}
        onChange={(key) => {
          setActiveKey(key)
        }}
      />
    </div>
  )
}

export default RichTextCompiler
