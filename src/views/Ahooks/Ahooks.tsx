/*
  ahooks 一套高质量可靠的 React Hooks 库
  官网: https://ahooks.js.org/zh-CN
  参考文献: https://blog.csdn.net/weixin_42662753/article/details/132322531
*/

import { CheckOutlined } from '@ant-design/icons'
import {
  useBoolean,
  useDebounce,
  useEventListener,
  useHover,
  useInterval,
  useKeyPress,
  useLocalStorageState,
  usePrevious,
  useSessionStorageState,
  useSize,
  useThrottle,
  useToggle,
  useUnmount,
  useUpdate,
  useUpdateEffect,
  useWhyDidYouUpdate
} from 'ahooks'
import { message } from 'antd'

import AhooksScss from './index.module.scss'

const MyComponent: React.FC = () => {
  useUnmount(() => {
    message.info('组件卸载 unmount')
  })
  return <p>Hello MyComponent!</p>
}

const MyDemo: React.FC<{ count: number }> = (props) => {
  const [randomNum, setRandomNum] = useState(Math.random())

  useWhyDidYouUpdate('useWhyDidYouUpdateComponent', { ...props, randomNum })

  return (
    <div>
      <div>
        <span>number: {props.count}</span>
      </div>
      <div>
        randomNum: {randomNum}
        <Button type='primary' onClick={() => setRandomNum(Math.random)} style={{ marginLeft: 8 }}>
          🎲
        </Button>
      </div>
    </div>
  )
}

const defaultArray = ['a', 'e', 'i', 'o', 'u']

const Ahooks: React.FC = () => {
  const refDom = useRef(null)
  const size1 = useSize(refDom) // 注意: 使用 useSize 能造成一次重新渲染
  const size2 = useSize(document.querySelector('.use-size')) // 注意: 使用 useSize 能造成一次重新渲染

  const [state1, { toggle: toggle1, setTrue, setFalse }] = useBoolean(true)
  const [state2, { toggle: toggle2, setLeft, setRight }] = useToggle()

  const refUseHover = useRef(null)
  const isHovering1 = useHover(refUseHover)
  const isHovering2 = useHover(() => document.querySelector('.hover-div'), {
    onEnter: () => {
      console.log('onEnter')
    },
    onLeave: () => {
      console.log('onLeave')
    },
    onChange: (isHover) => {
      console.log('onChange', isHover)
    }
  })

  const [value, setValue] = useState(0)
  const refUseState = useRef(null)
  useEventListener(
    'click',
    () => {
      setValue(value + 1)
    },
    { target: refUseState }
  )
  const [value1, setValue1] = useState('')
  useEventListener('keydown', (ev) => {
    setValue1(ev.code)
  })

  const [counter, setCounter] = useState(0)
  useKeyPress('uparrow', () => {
    setCounter((s) => s + 1)
  })
  /* keyCode value for ArrowDown */
  useKeyPress(40, () => {
    setCounter((s) => s - 1)
  })
  const [state, setState] = useState<number>()
  useKeyPress(['shift.c'], () => {
    setState(1)
  })
  useKeyPress(['meta'], () => {
    setState(2)
  })
  useKeyPress('ctrl.alt.c', () => {
    setState(3)
  })
  useKeyPress('ctrl.enter', () => {
    setState(4)
  })
  /* Attention: event.key === '0' */
  useKeyPress('ctrl.alt.0', () => {
    setState(5)
  })

  const [count, setCount] = useState(0)
  const previous = usePrevious(count)

  const update = useUpdate()

  const [state3, { toggle: toggle3 }] = useBoolean(true)

  const [value2, setValue2] = useState<string>('3000')
  const throttledValue = useThrottle(value2, { wait: 500 })
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue2(e.target.value)
  }

  const [value4, setValue4] = useState<string>()
  const debouncedValue = useDebounce(value4, { wait: 500 })

  const [count1, setCount1] = useState(500)
  const [effectCount, setEffectCount] = useState(500)
  const [updateEffectCount, setUpdateEffectCount] = useState(500)
  useEffect(() => {
    setEffectCount((c) => c + 1)
    return () => {}
  }, [count1])
  useUpdateEffect(() => {
    /* 忽略首次执行 */
    setUpdateEffectCount((c) => c + 1)
    return () => {}
  }, [count1])

  const [count2, setCount2] = useState(20)

  const [count3, setCount3] = useState(50)
  const [interval, setInterval] = useState<number | undefined>(1000)
  const clear = useInterval(() => {
    // setCount3(count3 + 1) 暂时注释掉
  }, interval)

  const [message, setMessage] = useLocalStorageState<string | undefined>('use-local-storage-state-demo1', {
    defaultValue: 'Hello~'
  })
  const [value3, setValue3] = useLocalStorageState('use-local-storage-state-demo2', {
    defaultValue: defaultArray
  })
  const [count4, setCount4] = useLocalStorageState('use-local-storage-state-demo4', {
    defaultValue: 80,
    listenStorageChange: true
  })

  console.log('组件渲染 - render')

  return (
    <div className={AhooksScss['a-hooks']}>
      <Card size='small' title='useSize 监听 DOM 节点尺寸变化的 Hook'>
        <div ref={refDom} className='use-size'>
          <p>尝试调整预览窗口的大小</p>
          <p>
            宽度: {size1?.width}px, 高度: {size1?.height}px
          </p>
          <p>
            宽度: {size2?.width}px, 高度: {size2?.height}px
          </p>
        </div>
      </Card>

      <Card size='small' title='useBoolean 优雅的管理 boolean 状态的 Hook'>
        <div>
          <p>Effects：{JSON.stringify(state1)}</p>
          <p>
            <Button type='primary' onClick={toggle1}>
              Toggle
            </Button>
            <Button type='primary' onClick={setFalse}>
              Set false
            </Button>
            <Button type='primary' onClick={setTrue}>
              Set true
            </Button>
          </p>
        </div>
      </Card>

      <Card size='small' title='useToggle 用于在两个状态值间切换的 Hook'>
        <div>
          <p>Effects：{`${state2}`}</p>
          <p>
            <Button type='primary' onClick={toggle2}>
              Toggle
            </Button>
            <Button type='primary' onClick={setLeft}>
              Toggle False
            </Button>
            <Button type='primary' onClick={setRight}>
              Toggle True
            </Button>
          </p>
        </div>
      </Card>

      <Card size='small' title='useHover 监听 DOM 元素是否有鼠标悬停'>
        <div ref={refUseHover}>
          <Alert message={isHovering1 ? 'hover' : 'leaveHover'} type='info' />
        </div>
        <div className='hover-div'>
          <Alert message={isHovering2 ? 'hover' : 'leaveHover'} type='info' />
        </div>
      </Card>

      <Card size='small' title='useEventListener 优雅的使用 addEventListener'>
        <Button ref={refUseState} color='primary' variant='filled'>
          {value}
        </Button>
        <Button color='primary' variant='filled'>
          {value1}
        </Button>
      </Card>

      <Card size='small' title='useKeyPress 监听键盘按键，支持组合键，支持按键别名'>
        <Button color='primary' variant='filled'>
          {counter}
        </Button>
        <div>
          <div>
            <div>1. Modifier key [shift.c]: {state === 1 && <CheckOutlined style={{ color: '#f00' }} />}</div>
            <div>2. Modifier key [meta]: {state === 2 && <CheckOutlined style={{ color: '#f00' }} />}</div>
            <div>3. Modifier key [ctrl.alt.c]: {state === 3 && <CheckOutlined style={{ color: '#f00' }} />}</div>
            <div>4. Modifier key [ctrl.enter]: {state === 4 && <CheckOutlined style={{ color: '#f00' }} />}</div>
            <div>5. Modifier key [ctrl.alt.0]: {state === 5 && <CheckOutlined style={{ color: '#f00' }} />}</div>
          </div>
        </div>
      </Card>

      <Card size='small' title='usePrevious 保存上一次状态的 Hook。'>
        <div>当前 value: {count}</div>
        <div style={{ marginBottom: 8 }}>上一次 value: {previous}</div>
        <Button type='primary' onClick={() => setCount((c) => c + 1)}>
          增加
        </Button>
        <Button type='primary' style={{ marginLeft: 8 }} onClick={() => setCount((c) => c - 1)}>
          减少
        </Button>
      </Card>

      <Card size='small' title='useUpdate 会返回一个函数，调用该函数会强制组件重新渲染'>
        <div>Time: {Date.now()}</div>
        <Button type='primary' onClick={update} style={{ marginTop: 8 }}>
          强制组件重新渲染
        </Button>
      </Card>

      <Card size='small' title='useUnmount 在组件卸载（unmount）时执行的 Hook'>
        <Button type='primary' onClick={toggle3}>
          {state3 ? '卸载组件' : '添加组件'}
        </Button>
        {state3 && <MyComponent />}
      </Card>

      <Card size='small' title='useThrottle 用来处理节流值的 Hook'>
        <Input placeholder='Basic usage' onChange={onChange} value={value2} />
        节流后：{throttledValue}
      </Card>

      <Card size='small' title='useDebounce 用来处理防抖值的 Hook'>
        <div>
          <Input placeholder='Typed value' onChange={(e) => setValue4(e.target.value)} value={value4} />
          <p style={{ marginTop: 16 }}>DebouncedValue: {debouncedValue}</p>
        </div>
      </Card>

      <Card size='small' title='useUpdateEffect 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行'>
        <div>
          <p>effectCount: {effectCount}</p>
          <p>updateEffectCount: {updateEffectCount}</p>
          <p>
            <Button type='primary' onClick={() => setCount1((c) => c + 1)}>
              Render
            </Button>
          </p>
        </div>
      </Card>

      <Card size='small' title='useWhyDidYouUpdate 帮助开发者排查是哪个属性改变导致了组件的 rerender'>
        <div>
          <MyDemo count={count2} />
          <div>
            <Button type='primary' onClick={() => setCount2((prevCount) => prevCount - 1)}>
              count -
            </Button>
            <Button type='primary' onClick={() => setCount2((prevCount) => prevCount + 1)} style={{ marginLeft: 8 }}>
              count +
            </Button>
          </div>
          <p style={{ marginTop: 8 }}>请打开浏览器控制台查看输出！</p>
        </div>
      </Card>

      <Card size='small' title='useInterval 一个可以处理 setInterval 的 Hook'>
        <div>
          <p> count3: {count3} </p>
          <p style={{ marginTop: 16 }}> interval: {(interval as number) / 1000}s </p>
          <Button type='primary' onClick={() => setInterval((t) => (t ? t + 1000 : 1000))} style={{ marginRight: 8 }}>
            interval + 1000
          </Button>
          <Button
            type='primary'
            style={{ marginRight: 8 }}
            onClick={() => {
              setInterval(1000)
            }}>
            reset interval
          </Button>
          <Button type='primary' onClick={clear}>
            clear
          </Button>
        </div>
      </Card>

      <Card size='small' title='useLocalStorageState 将状态存储在 localStorage 中的 Hook'>
        <Input
          placeholder='Please enter some words...'
          value={message || ''}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type='primary' style={{ margin: '0 8px' }} onClick={() => setMessage('Hello~')}>
          重置存储数据的状态
        </Button>
        <Button type='primary' onClick={() => setMessage(undefined)}>
          清除存储的数据
        </Button>

        <p>{value3?.join('-')}</p>
        <Button
          type='primary'
          onClick={() => setValue3([...(value3 as string[]), Math.random().toString(36).slice(-1)])}>
          存储复杂类型数据
        </Button>

        {/* 将 state 与 localStorage 保持同步 */}
        <div style={{ margin: '8px' }}>
          <Button type='primary' style={{ marginRight: '8px' }} onClick={() => setCount4(count4! + 1)}>
            count4: {count4}
          </Button>
          <Button type='primary' onClick={() => setCount4()}>
            Clear
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Ahooks
