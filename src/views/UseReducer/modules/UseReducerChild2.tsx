import { nanoid } from 'nanoid'

import type { PrevStatetype } from '../hooks'

interface PropsType {
  state: PrevStatetype
  dispatch: (action: { type: string; value?: any }) => void
}

const UseReducerChild2: React.FC<PropsType> = ({ state, dispatch }) => {
  const handleAdd = () => {
    dispatch({
      type: 'ADD_REGION'
    })
  }
  const handleSub = () => {
    dispatch({
      type: 'REMOVE_REGION',
      value: state.regions.slice(0, state.regions.length - 1)
    })
  }
  const handleFilter = () => {
    dispatch({
      type: 'FILTER_REGION',
      value: '上海'
    })
  }

  return (
    <div className='use-reducer-child1'>
      <Button type='primary' onClick={handleAdd}>
        添加上海地区
      </Button>
      <Button type='primary' onClick={handleSub}>
        去除最后一个地区
      </Button>
      <Button type='primary' onClick={handleFilter}>
        过滤上海地区
      </Button>

      {state.regions.map((item) => (
        <Tag color='#2db7f5' key={item.id}>
          {item.name}
        </Tag>
      ))}
    </div>
  )
}

export default UseReducerChild2
