import { memo } from 'react'

interface PropsType {
  value: number
}

const MemoChild1: React.FC<PropsType> = (props) => {
  console.log('MemoChild1组件 渲染了')

  return (
    <div>
      MemoChild1组件: &nbsp;
      <span>value {props.value}</span>
    </div>
  )
}

export default memo(MemoChild1)
