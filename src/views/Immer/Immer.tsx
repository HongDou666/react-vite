/*
  useImmer 用于管理不可变状态 它通过基于原始状态创建一个新的状态树来实现不可变性 它提供了一种简单而直观的方式来处理复杂的状态更新逻辑 使代码更易于理解和维护

  参考文献: https://blog.csdn.net/jieyucx/article/details/134118787
*/
import { produce } from 'immer'
import { nanoid } from 'nanoid'
import { useImmer, useImmerReducer } from 'use-immer'

import { intialState, intialState_1, reducer, reducer_1 } from './hooks'

type TodoType = {
  id: string
  title: string
  isShow: boolean
}

const Immer: React.FC = () => {
  const [listData, dispatch] = useReducer(reducer, intialState)
  const [listData_1, dispatch_1] = useImmerReducer(reducer_1, intialState_1)
  const [state, setState] = useImmer({
    name: '亚洲',
    plate: ['中国', '法国', '德国', '意大利', '西班牙', '俄罗斯', '巴西', '印度', '加拿大'],
    region: {
      country: '中国',
      citys: [
        {
          name: '北京',
          area: 123
        },
        {
          name: '上海',
          area: 456
        },
        {
          name: '广州',
          area: 789
        }
      ]
    }
  })

  const [todos, setTodos] = useState<TodoType[]>([
    {
      id: nanoid(),
      title: 'React',
      isShow: true
    },
    {
      id: nanoid(),
      title: 'Vue',
      isShow: true
    }
  ])

  const handleToggle = useCallback((id) => {
    setTodos(
      produce((draft) => {
        const todo = draft.find((todo) => todo.id === id)
        todo!.isShow = !todo?.isShow
      })
    )
  }, [])
  const handleAdd = useCallback(() => {
    setTodos(
      produce((draft) => {
        draft.push({
          id: nanoid(),
          title: `A new todo ${draft.length - 1}`,
          isShow: true
        })
      })
    )
  }, [])

  const handleToggle_1 = useCallback((id) => {
    dispatch({ type: 'toggle', id })
  }, [])
  const handleAdd_1 = useCallback(() => {
    dispatch({ type: 'add', id: nanoid() })
  }, [])

  /* 更新嵌套对象的示例函数 */
  const handleUpdate = () => {
    setState((draft) => {
      draft.name = '欧洲小镇'
      draft.plate.push('英国')
      draft.region.citys[0].name = '深圳'

      const item = draft.region.citys.find((item) => item.area === 789)
      item && (item.name = '杭州')
    })
  }

  return (
    <div>
      {/* 1. useImmer */}
      <Button type='primary' onClick={handleUpdate}>
        改变结构数据
      </Button>
      <div>
        板块:<Tag color='processing'>{state.name}</Tag>
      </div>
      <div>
        地区:
        {state.plate.map((item) => (
          <Tag key={nanoid()} color='processing'>
            {item}
          </Tag>
        ))}
      </div>
      <div>
        来自:
        <Tag color='processing'>{state.region.country}</Tag>
        <br />
        城市:
        {state.region.citys.map((item) => (
          <Tag key={nanoid()} color='processing'>
            {item.name}
          </Tag>
        ))}
      </div>

      {/* 2. immer */}
      <br />
      <Button type='primary' onClick={handleAdd}>
        添加一个数据对象
      </Button>
      {todos.map(
        (item) =>
          item.isShow && (
            <Space
              key={item.id}
              onClick={() => {
                handleToggle(item.id)
              }}>
              <Tag color='processing'>{item.title}</Tag>
            </Space>
          )
      )}

      {/* 3. useReducer + Immer */}
      <br />
      <Button type='primary' onClick={handleAdd_1}>
        添加一个数据对象
      </Button>
      {listData.map(
        (item) =>
          item.isShow && (
            <Space
              key={item.id}
              onClick={() => {
                handleToggle_1(item.id)
              }}>
              <Tag color='processing'>{item.title}</Tag>
            </Space>
          )
      )}

      {/* 4. useImmerReducer */}
      <br />
      <Button
        type='primary'
        onClick={() => {
          dispatch_1({ type: 'add', id: nanoid() })
        }}>
        添加一个数据对象
      </Button>
      {listData_1.map(
        (item) =>
          item.isShow && (
            <Space
              key={item.id}
              onClick={() => {
                dispatch_1({ type: 'toggle', id: item.id })
              }}>
              <Tag color='processing'>{item.title}</Tag>
            </Space>
          )
      )}
    </div>
  )
}

export default Immer
