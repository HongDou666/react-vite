import type { InputNumberProps } from 'antd'
import { Image } from 'antd'
import { message } from 'antd'
import { Observer, observer, useLocalObservable, useObserver } from 'mobx-react'
import { nanoid } from 'nanoid'

import useStore from '@/mobox/useStore'

const param = {
  node: {
    cityId: 440300,
    pageNum: 1,
    pageSize: 6,
    type: 1,
    k: 320674
  },
  config: {
    headers: {
      'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"173223556337542309134337","bc":"440300"}',
      'X-Host': 'mall.film-ticket.film.list'
    }
  }
}

const MobX: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()

  /* 用于在函数式组件中创建局部可观察（Observable）的数据。它允许你在组件内部定义和管理自己的状态，并且这些状态的变化能够被自动追踪和响应 不需要像 useState 那样手动触发重新渲染（通过setState） */
  const homeStore = useLocalObservable(() => ({
    address: '北京',
    isFriend: false,
    toDoList: ['吃饭', '睡觉', '打豆豆'],
    changeFiend(isF) {
      this.isFriend = isF
    },
    get friendMsg() {
      return this.isFriend ? '好朋友' : '陌生人'
    },
    set setAddress(value: string) {
      this.address = value
    }
  }))
  const store = useStore('users')
  const [value, setValue] = useState<number | null>()
  const pageNum = useRef(0)

  const handleClick1 = () => {
    store.increaseAmount()
  }

  const handleChange: InputNumberProps['onChange'] = (val) => {
    setValue(val as number)
    store.total = val as number
  }

  const handleClick2 = () => {
    store.increaseCar({ name: '法拉利', price: 100 })
  }

  const handleClick3 = () => {
    pageNum.current++
    param.node.pageNum = pageNum.current
    store.addListData(param)
  }

  useEffect(() => {
    store.addListData(param)
  }, [store])

  useEffect(() => {
    messageApi.info('商品数量改为: ' + store.amount)
  }, [messageApi, store.amount])

  /*
    ⚠️⚠️⚠️[mobx-react-lite] 'useObserver(fn)' is deprecated. Use<Observer>{fn}</Observer>instead, or wrap the entire component inobserver.

    return useObserver(() => {
      return (<div> .... </div>)
    })
  */
  return (
    <div>
      {contextHolder}
      <span>商品价格:</span>
      <InputNumber
        defaultValue={store.price}
        style={{ width: 150, margin: '0 10px' }}
        placeholder='输入商品价格'
        min={1}
        max={1000}
        value={value}
        onChange={handleChange}
      />
      <Button type='primary' onClick={handleClick1}>
        商品数量 + 1
      </Button>
      <p>
        商品数量：<Tag color='processing'>{store.amount}</Tag>
      </p>
      <p>
        商品价格：<Tag color='processing'>{store.price}</Tag>
      </p>
      <p>
        商品总金额：<Tag color='processing'>{store.total}</Tag>
      </p>
      <hr />
      <Button style={{ marginRight: 10 }} type='primary' onClick={handleClick2}>
        添加一辆车
      </Button>
      {store.getCarsList.map((item) => (
        <Tag key={nanoid()} color='processing'>
          {item.name} {item.price}
        </Tag>
      ))}
      <hr />
      <Button type='primary' onClick={handleClick3}>
        刷新电影列表
      </Button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {store.listData.map((val, index) => {
          return <Image key={index} width={80} src={val.poster} />
        })}
      </div>
      <hr />
      <Button type='primary' onClick={() => homeStore.changeFiend(!homeStore.isFriend)}>
        改变关系
      </Button>
      <Button type='primary' onClick={() => (homeStore.setAddress = homeStore.address === '北京' ? '上海' : '北京')}>
        改变地址
      </Button>
      <p>
        地址：<Tag color='processing'>{homeStore.address}</Tag>
      </p>
      <p>
        关系：<Tag color='processing'>{homeStore.friendMsg}</Tag>
      </p>
      <p>
        待办事项：
        {homeStore.toDoList.map((item) => (
          <Tag key={nanoid()} color='processing'>
            {item}
          </Tag>
        ))}
      </p>

      {/* 使用 Observer 包裹的会自动改变，而外部的不会 因为整个组件已经被 observer(MobX) 包裹了 在使用 Observer 已经没有必要了 */}
      <Observer>
        {() => {
          return (
            <p>
              地址：<Tag color='processing'>{homeStore.address}</Tag>
            </p>
          )
        }}
      </Observer>
    </div>
  )
}

export default observer(MobX)
