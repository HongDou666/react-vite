import MemoChild1 from './modules/MemoChild1'
import MemoChild2 from './modules/MemoChild2'
import MemoChild3 from './modules/MemoChild3'

const Memo: React.FC = () => {
  const [value, setValue] = useState(10)
  const [count, setCount] = useState(100)
  const [number, setNumber] = useState(200)
  const [dataValue, setDataValue] = useState({
    name: '河南省',
    city: [
      {
        id: useId(), // 用于生成唯一 ID
        name: '郑州市',
        area: ['中原区', '二七区']
      },
      {
        id: useId(), // 用于生成唯一 ID
        name: '洛阳市',
        area: ['西工区', '涧西区']
      }
    ]
  })
  const state = useRef('晚风')
  const memoList = useMemo(() => ['100', '200'], [])

  const handleValue = () => {
    setValue(value + 1)
  }
  const handleCount = () => {
    setCount(count + 1)
  }
  const handleNumber = () => {
    setNumber(number + 1)
  }

  return (
    <div>
      <Button type='primary' onClick={handleValue}>
        value 数值 +1
      </Button>
      <Button type='primary' onClick={handleCount}>
        count 数值 +1
      </Button>
      <Button type='primary' onClick={handleNumber}>
        number 数值 +1
      </Button>

      {/*
        问题: 父组件重新渲染 子组件也跟着跟着一起渲染
        方案: 利用memo进行缓存 只有props发生变化的时候才会重新渲染
        实际上 React.memo 的源码就是返回一个 PureComponent 组件
      */}
      <MemoChild1 value={value} />
      <MemoChild2 count={count} dataValue={dataValue} state={state.current} memoList={memoList} />
      {useMemo(
        () => (
          <MemoChild3 number={number} />
        ),
        [number]
      )}
    </div>
  )
}

export default Memo
