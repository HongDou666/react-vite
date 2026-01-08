/*
  useCallback(记忆函数)
  防止因为组件重新渲染，导致方法被重新创建 ，起到缓存作用; 只有第二个参数 变化了，才重新声明一次
*/

import { message } from 'antd'

import UseCallbackChild from './modules/UseCallbackChild'

type ChildPropsType = {
  count: number
  setCount: (count: number) => void
  str: string
}

const Child: React.FC<ChildPropsType> = ({ count, setCount, str }) => {
  console.log('Child组件 执行render渲染')
  return (
    <Space wrap>
      <h1>Child组件:</h1>
      <Tag color='#2db7f5'>count: {count}</Tag>
      <Button type='primary' onClick={() => setCount(5)}>
        count +5
      </Button>
      <Tag color='#f50'>{str}</Tag>
    </Space>
  )
}

const MemoChild = memo(Child)

const UseCallback: React.FC = () => {
  const [number, setNumber] = useState(0)
  const [count, setCount] = useState(0)
  const sum = useRef<number>(100)
  const str = '只许州官放火,不许百姓点灯!!!'

  /* 每次组件重新渲染 导致方法被重新创建 */
  const handleAdd = () => {
    setNumber(number + 1)

    /* 不使用 useState 的情况下; 也可以记忆缓存sum值 */
    sum.current = sum.current + 1
  }

  /* 每次组件重新渲染 导致方法被重新创建 */
  const handleAdd1 = () => {
    setCount(count + 1)
  }

  /* useCallback 只有当声名的依赖发生变化时才会导致方法被重新创建; number发生变化 还是会起到缓存作用 缓存钩子函数 */
  const handleAdd2 = useCallback(() => {
    message.success('count: ' + count)

    // 注意: 这里如果数组不依赖于任何状态 那么当多次执行了 handleAdd1 方法 在执行 handleAdd2 方法时 输出的 count 数值 依旧是 0
  }, [count])

  const handleAdd3 = useCallback(
    (value) => {
      setCount(count + value)
    },
    // 1. 这里使用了 useCallback 组件传递的函数引用地址不会改变 从而避免了 MemoChild组件 的无必要渲染;
    // 2. 如果是普通函数 即使 MemoChild组件 已经使用 memo 包裹 依旧会导致非必要的渲染 因为memo 会对属性进行对比 Object.is(); 发现函数的引用地址改变了 导致组件重新渲染
    // 3. 如果把 count 从依赖数组中移除掉 那么每次点击 MemoChild组件 的按钮 count 数值都变成 5; 因为 handleAdd3 方法引用的 count 永远是初始值 0
    [count]
  )

  /* 如果不用 useCallback 把当前函数缓存起来; 那么父组件更新 子组件也跟着一起更新; 即使用memo包裹起来也不行 因为传递函数的引用地址改变了 父组件重新渲染 导致当前函数会重新声明一次 */
  const handleChange = useCallback((event: Event) => {
    console.log('event', event)
  }, [])

  return (
    <div>
      <Space wrap className='m-block-10px block'>
        <Button type='primary' onClick={handleAdd}>
          (number & sum) 数值 +1
        </Button>
        <Tag color='#2db7f5'>number: {number}</Tag>
        <Tag color='#2db7f5'>sum: {sum.current}</Tag>
      </Space>
      <Space wrap className='m-block-10px block'>
        <Button type='primary' onClick={() => handleAdd1()}>
          count 数值 +1
        </Button>
        <Tag color='#2db7f5'>count: {count}</Tag>
        <Button type='primary' onClick={() => handleAdd2()}>
          输出 count 数值
        </Button>
      </Space>
      <Space wrap className='m-block-10px block'>
        {/* 二者缺一不可:
          1. 这里传入 MemoChild 组件的 handleAdd3 使用了 useCallback 缓存 所以地址不会改变
          2. 又因为 MemoChild 组件使用了 memo 包裹 所以只有当 count 数值发生变化时 才会重新渲染 
          补充: 
            (1) 这里不用管 count 的地址是否会发生改变 因为 他是从 useState 钩子函数中获取的 所以地址不会改变
            (2) str 是 string 类型 (number boolean null undefined) 这些值本身不会变引用，所以不会导致 MemoChild 组件的无必要渲染; 即使父组件重新 render 只要 str 没变 → 子组件不会更新
          */}
        <MemoChild count={count} setCount={handleAdd3} str={str} />
      </Space>
      str
      <Space wrap className='m-block-10px block'>
        <UseCallbackChild onChange={handleChange}></UseCallbackChild>
      </Space>
    </div>
  )
}

export default UseCallback
