/* 引入 connect 用于连接 UI组件 与 redux */
import { connect } from 'react-redux'
import { Image, message } from 'antd'
import { nanoid } from 'nanoid'

/* 引入 action */
import { cinemaListAsync, cinemaListAsyncPromise, decrement, increment, incrementAsync } from '@/store/actions/count'

interface PropsType {
  count: number
  personCount: string
  maizuoList: Record<string, any>[]
  dispatchIncrement: (data: number) => void
  dispatchDecrement: (data: number) => void
  dispatchIncrementAsync: (data: number, time: number) => void
  dispatchCinemaListAsync: (data: Record<string, any>) => Promise<any>
  dispatchCinemaListAsyncPromise: (data: Record<string, any>) => Promise<any>
}

const param = {
  node: {
    cityId: 320100,
    pageNum: 1,
    pageSize: 6,
    type: 1,
    k: 320674
  },
  config: {
    headers: {
      'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"173223556337542309134337","bc":"320100"}',
      'X-Host': 'mall.film-ticket.film.list'
    }
  }
}

const ReduxChild1: React.FC<PropsType> = (props) => {
  const {
    count,
    maizuoList,
    personCount,
    dispatchIncrement,
    dispatchDecrement,
    dispatchIncrementAsync,
    dispatchCinemaListAsync,
    dispatchCinemaListAsyncPromise
  } = props

  const [messageApi, contextHolder] = message.useMessage()
  const pageNum = useRef(1)
  const [modelValue, setModelValue] = useState(1)
  const [options] = useState([
    { value: 1, label: '数值 1' },
    { value: 2, label: '数值 2' },
    { value: 3, label: '数值 3' }
  ])

  useEffect(() => {
    /* 此处的网络请求只会调用一次 */
    dispatchCinemaListAsync(param)
  }, [dispatchCinemaListAsync])

  const handleChange = (value: number) => {
    setModelValue(value)
  }

  // 加法
  const handleAdd = () => {
    dispatchIncrement(modelValue)
  }
  // 减法
  const handleSub = () => {
    dispatchDecrement(modelValue)
  }
  // 奇数再加
  const handleOdd = () => {
    if (count % 2 !== 0) {
      dispatchIncrement(modelValue)
    }
  }
  // 异步加
  const handleSetTimeout = () => {
    dispatchIncrementAsync(modelValue, 500)
  }
  // 刷新电影列表 redux-thunk
  const handleReduxThunk = () => {
    pageNum.current++
    param.node.pageNum = pageNum.current
    // 这里 dispatchCinemaListAsync(param) 返回的是一个 Promise 对象，所以这里可以使用 then 方法来处理异步操作
    dispatchCinemaListAsync(param).then(() => {
      messageApi.success('刷新成功了')
    })
  }
  // 刷新电影列表 redux-promise
  const handleReduxPromise = () => {
    pageNum.current++
    param.node.pageNum = pageNum.current
    dispatchCinemaListAsyncPromise(param).then(() => {
      messageApi.success('刷新成功了')
    })
  }

  return (
    <>
      {contextHolder}
      <div
        style={{
          border: '5px solid #ff4400bd',
          padding: '10px'
        }}>
        <h1>ReduxChild2 组件总人数为: {personCount} 人</h1>
        <h1>当前求和 count 为: {count}</h1>
        <Select style={{ width: 150 }} onChange={handleChange} options={options} value={modelValue} />
        <Button type='primary' style={{ margin: '0 5px' }} onClick={handleAdd}>
          +
        </Button>
        <Button type='primary' style={{ margin: '0 5px' }} onClick={handleSub}>
          -
        </Button>
        <Button type='primary' style={{ margin: '0 5px' }} onClick={handleOdd}>
          当前求和为奇数再加
        </Button>
        <Button type='primary' style={{ margin: '0 5px' }} onClick={handleSetTimeout}>
          异步加
        </Button>
        <Button type='primary' style={{ margin: '0 5px' }} onClick={handleReduxThunk}>
          刷新电影列表 redux-thunk
        </Button>
        <Button type='primary' style={{ margin: '0 5px' }} onClick={handleReduxPromise}>
          刷新电影列表 redux-promise
        </Button>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {maizuoList.map((val, index) => (
            <Image key={nanoid()} width={80} height={120} src={val.poster} />
          ))}
        </div>
      </div>
    </>
  )
}

/*
  使用 connect()() 创建并暴露一个 ReduxChild1 的容器组件
  注意: 当 state.count.value、state.count.cinemaList、state.persons.personList.length 发生改变时，就会触发 ReduxChild1 组件的重新渲染
*/
export default connect(
  (state: Record<string, any>) => {
    return {
      count: state.count.value,
      maizuoList: state.count.cinemaList,
      personCount: state.persons.personList.length
    }
  },
  {
    dispatchIncrement: increment,
    dispatchDecrement: decrement,
    dispatchIncrementAsync: incrementAsync,
    dispatchCinemaListAsync: cinemaListAsync,
    dispatchCinemaListAsyncPromise: cinemaListAsyncPromise
  }
)(ReduxChild1)
