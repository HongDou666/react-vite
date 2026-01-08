import type { TabsProps } from 'antd'

import EchartsDemo1 from './modules/EchartsDemo1'
import EchartsDemo2 from './modules/EchartsDemo2'
import EchartsDemo3 from './modules/EchartsDemo3'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Echarts 封装demo1 (初次)',
    children: <EchartsDemo1 />
  },
  {
    key: '2',
    label: 'Echarts 封装demo2',
    children: <EchartsDemo2 />
  },
  {
    key: '3',
    label: 'Echarts 封装demo3',
    children: <EchartsDemo3 />
  }
]

const Echarts: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('3')
  const onChange = (key: string) => {
    setActiveKey(key)
  }

  return <Tabs activeKey={activeKey} items={items} onChange={onChange} />
}

export default Echarts
