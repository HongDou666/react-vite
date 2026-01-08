import { useAliveController } from 'react-activation'
import { DeleteOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'

const KeepAliveDemo2: React.FC = () => {
  const params = useParams()
  const [value, setValue] = useState('')
  const { drop, refresh, clear, getCachingNodes } = useAliveController()

  useEffect(() => {
    console.log('KeepAliveDemo2: 页面-useEffect')
  }, [])

  return (
    <>
      <div className='h-600px overflow-y-auto bg-#d3346942'>
        <Space wrap>
          <Button icon={<RedoOutlined />} type='primary' onClick={() => refresh('demo1')}>
            刷新 id 等于 demo1 的页面缓存
          </Button>
          <Button icon={<RedoOutlined />} type='primary' onClick={() => refresh(`demo2-${params.id}`)}>
            刷新 动态路由 的页面缓存
          </Button>
          <Button icon={<DeleteOutlined />} type='primary' onClick={() => drop('demo1')}>
            删除 id 等于 demo1 的页面缓存
          </Button>
          <Button
            icon={<SearchOutlined />}
            type='primary'
            onClick={() => {
              const cache = getCachingNodes()
              console.log(cache)
            }}>
            查看当前所有缓存节点
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type='primary'
            onClick={() => {
              clear()
            }}>
            清除所有缓存节点 (不包括当前自身)
          </Button>
        </Space>

        <div className='text-20px c-#ff8f57'>{params.id}</div>
        <div className='pos-relative h-100vh'>
          <Input
            className='pos-absolute top-40% h34px'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='带有缓存功能'
          />
        </div>
      </div>
    </>
  )
}

export default KeepAliveDemo2
