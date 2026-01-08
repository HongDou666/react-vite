interface PropsType {
  number: number
}

const MemoChild3: React.FC<PropsType> = (props) => {
  console.log('MemoChild3组件 渲染了')

  return (
    <div>
      MemoChild3组件: &nbsp;
      <span>value {props.number}</span>
    </div>
  )
}

export default MemoChild3
