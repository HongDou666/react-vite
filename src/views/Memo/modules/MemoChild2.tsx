import { memo } from 'react'

interface PropsType {
  count: number
  dataValue: {
    name: string
    city: {
      id: string
      name: string
      area: string[]
    }[]
  }
  state?: string
  memoList?: string[]
}

const MemoChild2: React.FC<PropsType> = (props) => {
  console.log('MemoChild2组件 渲染了')

  const { count, dataValue, state, memoList } = props

  return (
    <div>
      MemoChild2组件: &nbsp;
      <span>value {count}</span>
      <Tag color='#55acee'>{state}</Tag>
      {memoList && memoList.map((item, index) => <Tag key={index}>{item}</Tag>)}
      {dataValue.city.map((item) => {
        return (
          <div key={item.id}>
            <Tag color='#55acee'>{item.name}</Tag>
            {item.area.length && item.area.map((subItem, subIndex) => <Tag key={subIndex}>{subItem}</Tag>)}
          </div>
        )
      })}
    </div>
  )
}

export default memo(MemoChild2)
