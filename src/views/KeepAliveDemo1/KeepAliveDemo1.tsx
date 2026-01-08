import { useActivate, useAliveController, useUnactivate } from 'react-activation'
import { Input } from 'antd'
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons'

const KeepAliveDemo1: React.FC = () => {
  const [value, setValue] = useState('')

  useActivate(() => {
    message.info('KeepAliveDemo1: 页面-激活')
  })

  useUnactivate(() => {
    message.info('KeepAliveDemo1: 页面-缓存')
  })

  const { refreshScope, dropScope } = useAliveController()

  return (
    <>
      <div className='h-600px overflow-y-auto bg-#d3346942'>
        <Space wrap>
          <Button
            icon={<RedoOutlined />}
            type='primary'
            onClick={() => {
              refreshScope('demo3') // 可以匹配到 demo3-10 demo3-20 demo3-30
            }}>
            刷新 id 以 demo3 开头的所有页面缓存
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type='primary'
            onClick={() => {
              dropScope('demo3') // 可以匹配到 demo3-10 demo3-20 demo3-30
            }}>
            清除 id 以 demo3 开头的所有页面缓存
          </Button>
        </Space>

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

export default KeepAliveDemo1
