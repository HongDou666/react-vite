import type { TabsProps } from 'antd'

import ReduxChild1 from './modules/ReduxChild1'
import ReduxChild2 from './modules/ReduxChild2'
import ReduxChild3 from './modules/ReduxChild3'
import ReduxChild4 from './modules/ReduxChild4'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'ReduxChild1',
    children: <ReduxChild1 />
  },
  {
    key: '2',
    label: 'ReduxChild2',
    children: <ReduxChild2 />
  },
  {
    key: '3',
    label: 'ReduxChild3',
    children: <ReduxChild3 />
  },
  {
    key: '4',
    label: 'ReduxChild4',
    children: <ReduxChild4 />
  }
]

const ReduxDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('4')

  const onChange = (key: string) => {
    setActiveKey(key)
  }

  return (
    <>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </>
  )
}

export default ReduxDemo
