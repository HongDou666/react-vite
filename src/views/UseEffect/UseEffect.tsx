import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import type { InputRef } from 'antd'
import dayjs from 'dayjs'

import UseEffectChild1 from './modules/UseEffectChild1'

const UseEffect: React.FC = () => {
  const htmlDiv = `<h1 style='color: #f40;font-size:20px'>This text is set using innerHTML</h1>`

  const [infoDate] = useState(() => {
    const area = '北京时间'
    const time = dayjs().format('YYYY-MM-DD HH:mm')
    return {
      date: `${area}: ${time}`
    }
  })
  const [count, setCount] = useState(0)
  const [number, setNumber] = useState(10)
  const [value, setValue] = useState(20)
  const [visible, setVisible] = useState(false)
  const refDom = useRef<HTMLDivElement>(null)
  const inputRef = useRef<InputRef>(null)
  const timer = useRef(null)
  const [total, setTotal] = useState(0)
  const divRef = useRef(null)
  const [sumDemo, setSumDemo] = useState(0)

  /*
    useEffect 是在组件渲染到屏幕之后异步执行的 它不会阻塞浏览器的绘制过程，可以用于大多数副作用场景，比如数据获取、订阅或者手动修改DOM当组件更新后等
    参考文献(React18 useEffect 会执行两次): https://juejin.cn/post/7137654077743169573
  */
  useEffect(
    () => {
      console.log('count - useEffect 执行')
      return () => {
        console.log('count - useEffect 销毁')
      }
    },
    /*
      1. 如果指定的是[], 回调函数只会在第一次render()后执行; 回调函数所返回的函数会在组件卸载前执行
      2. 如果不写数组 则会监测到每一个数据的变化 （当某个数据变化时 先执行回调函数所返回的函数，在执行回调函数）（包括初始化也会执行一次）
      3. 如果指定的是[count], 回调函数会在每次count变化后执行（当数据变化时 先执行回调函数所返回的函数，在执行回调函数）（包括初始化也会执行一次）

      注意: useRef的值不能作为useEffect等其他hooks的依赖项，因为它并不是一个响应式状态
    */
    [count]
  )

  useEffect(() => {
    console.log('useEffect 获取Dom', refDom?.current)
  }, [visible])

  const handleAdd1 = () => {
    /* setCount(count+1) */
    setCount((count) => count + 1)
  }

  const handleAdd2 = () => {
    setNumber((number) => {
      number++
      console.log(`number 最新的值: `, number)
      return number
    })
    console.log('number 原先的值: ', number)
  }

  const handleAdd3 = () => {
    /* 多次执行setNumber => react做出了优化只渲染一次 */

    /* 最终 number 更新为 100 的值 */
    // setNumber(number + 1)
    // setNumber(number + 1)
    // setNumber(100)

    /* 状态叠加 最终 number 更新为 number + 3 的值 */
    setNumber((number) => number + 1)
    setNumber((number) => number + 1)
    setNumber((number) => number + 1)
  }

  const handleAddAsync = async () => {
    await setValue(value + 5)
    /* await => 先打印 render...; 后打印 value 的值 (value 还是原先的值) */
    console.log('value: ', value)
  }

  const handleAddFlushSync = () => {
    // setSumDemo(sumDemo + 1)

    // 使用 flushSync 来强制同步更新 DOM (flushSync是为解决与​​ DOM​​ 相关的紧急更新而设计的)
    flushSync(() => {
      // 这个 state 更新会立即、同步地应用到 DOM
      setSumDemo(sumDemo + 1)
    })

    // 因为 DOM 已经同步更新了，这里可以立即获取到最新的 DOM 元素布局 (sumDemo 还是原先的值)
    console.log('divRef: ', divRef.current)
  }

  const handleVisible = async () => {
    /*
    visible 设置为true; 紧接着打印 Dom 元素
      1. setTimeout(() => {}, 0)
      2. await setVisible()
      3. useEffect
    */
    visible ? await setVisible(false) : await setVisible(true)
    console.log(refDom?.current)

    /*
      setTimeout(() => {
        visible ? setVisible(false) : setVisible(true)
        console.log(refDom?.current) // 获取到 div 元素
      }, 0)
    */
  }

  /* 卸载Dom元素 */
  const unmount = () => {
    const container = document.getElementById('unmountCmp') as HTMLDivElement
    const root = createRoot(container)
    root.unmount()
  }

  const handleStart = () => {
    if (timer.current) return
    timer.current = setInterval(() => {
      // setTotal(total + 1) 不鞥这样写 (因为setTotal是异步执行; total 还是原来的值) 解决: 使用函数式更新
      setTotal((total) => total + 1)
    }, 1000) as any
  }
  const handleEnd = () => {
    if (!timer.current) return
    clearInterval(timer.current)
    timer.current = null
  }
  useEffect(() => {
    return () => {
      handleEnd()
    }
  }, [])

  console.log('render...')

  return (
    <div>
      <Alert message={infoDate.date} type='success' />

      <h2>
        count 当前值为：<b>{count}</b>
      </h2>
      <h2>
        number 当前值为：<b>{number}</b>
      </h2>
      <h2>
        value 当前值为：<b>{value}</b>
      </h2>
      <h2>
        total 当前值为：<b>{total}</b>
      </h2>
      <h2>
        sumDemo 当前值为：<b>{sumDemo}</b>
      </h2>
      {sumDemo % 2 && (
        <div ref={divRef} style={{ color: '#f50' }}>
          divRef 元素内容
        </div>
      )}
      <Input style={{ width: 200 }} ref={inputRef} />
      <br />
      <Button style={{ margin: '10px 10px 10px 0' }} type='primary' onClick={handleAdd1}>
        count + 1 (常规)
      </Button>
      <Button style={{ margin: '10px 10px 10px 0' }} type='primary' onClick={handleAdd2}>
        number + 1 (函数)
      </Button>
      <Button style={{ margin: '10px 10px 10px 0' }} type='primary' onClick={handleAdd3}>
        number + 1 (函数叠加)
      </Button>
      <Button style={{ margin: '0 10px 0 0' }} type='primary' onClick={handleAddAsync}>
        value + 1 (async)
      </Button>
      <Button style={{ margin: '0 10px 0 0' }} type='primary' onClick={handleAddFlushSync}>
        sumDemo + 1 (flushSync)
      </Button>
      <Button
        style={{ margin: '0 10px 0 0' }}
        type='primary'
        onClick={() => {
          console.log('inputRef', inputRef.current)
        }}>
        获取输入框Dom
      </Button>
      <Button style={{ margin: '0 10px 0 0' }} type='primary' onClick={handleVisible}>
        获取Dom元素 (相当于 nextTick)
      </Button>
      <Button style={{ margin: '0 10px 0 0' }} type='primary' onClick={unmount}>
        卸载指定的Dom元素
      </Button>
      <Button style={{ margin: '0 10px 0 0' }} type='primary' onClick={handleStart}>
        开启定时器
      </Button>
      <Button style={{ margin: '0 10px 0 0' }} type='primary' onClick={handleEnd}>
        关闭定时器
      </Button>

      {/* 元素的显示与隐藏 */}
      {visible && <div ref={refDom}>显示与隐藏</div>}

      {/* 相当于vue中的 <div html='<p>标签</p>'></div> */}
      <h1 dangerouslySetInnerHTML={{ __html: htmlDiv }}></h1>

      <div id='unmountCmp'>要被卸载的元素</div>

      <hr />

      {/* 两者只可查看其一; 方能看到useLayoutEffect 和 useEffect的区别 */}
      {/* <UseEffectChild1.useEffectDemo /> */}
      <UseEffectChild1.useEffectDemo2 />

      <UseEffectChild1.useEffectDemo3 />
    </div>
  )
}

export default UseEffect
