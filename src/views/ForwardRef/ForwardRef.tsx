import { UserOutlined } from '@ant-design/icons'

import withClassLog from './hoc/withClassLog'
import withFuncLog from './hoc/withFuncLog'
import ForwardRefChild1 from './modules/ForwardRefChild1'
import ForwardRefChild2 from './modules/ForwardRefChild2'
import ForwardRefChild3 from './modules/ForwardRefChild3'
import ForwardRefChild4 from './modules/ForwardRefChild4'

const WithClassLog = withClassLog(ForwardRefChild4, 'withClassLog')
const WithFuncLog = withFuncLog(ForwardRefChild4, 'withFuncLog')

const ForwardRef: React.FC = () => {
  const [count, setCount] = useState<number>(0)
  const [dataValue, setDataValue] = useState<string>('汤姆')

  /* useRef不能直接获取子组件的实例，需要使用forwardRef */
  const refDom = useRef<HTMLInputElement>(null)
  const refVideoDom = useRef<HTMLVideoElement>(null)
  const refChild = useRef<Record<string, any>>()
  const refChild4 = useRef<HTMLButtonElement>(null)
  const refChild5 = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    refDom.current!.focus()
    setCount(count + 1)
  }

  const prefix = useMemo(() => <UserOutlined />, [])

  const handleChange = useCallback((value) => {
    setDataValue(value)
  }, [])

  const handleToDo = () => {
    console.log('refChild', refChild)

    if (refChild.current) {
      refChild.current.openMessage()
      const data = refChild.current!.getInfo()
      console.log('子组件中的数据', data)
    }
  }

  const handleReset = () => {
    refChild.current && refChild.current.reset()
  }

  const handleClickLog1 = () => {
    console.log(refChild4.current)
    refChild4.current?.click()
  }
  const handleClickLog2 = () => {
    console.log(refChild5.current)
    refChild5.current?.click()
  }

  return (
    <Space direction='vertical'>
      <Card title='ForwardRefChild1'>
        <Button type='primary' onClick={handleClick}>
          点击获取焦点 {count} 次
        </Button>
        <ForwardRefChild1
          size='large'
          placeholder='输入名称'
          prefix={prefix}
          value={dataValue}
          handleChange={handleChange}
          ref={refDom}
        />
      </Card>

      <Card title='ForwardRefChild2'>
        <Button type='primary' onClick={() => refVideoDom.current?.play()}>
          视频播放
        </Button>
        <Button type='primary' onClick={() => refVideoDom.current?.pause()}>
          视频暂停
        </Button>
        <ForwardRefChild2
          ref={refVideoDom}
          src='https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
          type='video/mp4'
          width='250'
        />
      </Card>

      <Card title='ForwardRefChild3'>
        <Space>
          <Button type='primary' onClick={handleToDo}>
            执行子组件内部的方法
          </Button>
          <Button type='primary' onClick={handleReset}>
            使子组件数据重置
          </Button>
          <ForwardRefChild3 ref={refChild} />
        </Space>
      </Card>

      <Card title='ForwardRefChild4'>
        <Space>
          <Button type='primary' onClick={handleClickLog1}>
            获取子组件的Button并点击 WithClassLog
          </Button>
          <WithClassLog ref={refChild4} name='火影' />
        </Space>
        <Space className='m-t-10px'>
          <Button type='primary' onClick={handleClickLog2}>
            获取子组件的Button并点击 WithFuncLog
          </Button>
          <WithFuncLog ref={refChild5} name='七龙珠' />
        </Space>
      </Card>
    </Space>
  )
}

export default ForwardRef
