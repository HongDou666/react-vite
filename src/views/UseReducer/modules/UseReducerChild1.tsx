interface PropsType {
  state: any
  dispatch: (action: any) => void
}

const UseReducerChild1: React.FC<PropsType> = ({ state, dispatch }) => {
  const handleAdd = () => {
    const value = state.count - 1
    dispatch({
      type: 'zqc-minus',
      value
    })
  }

  return (
    <div className='use-reducer-child1'>
      <h1>UseReducerChild1</h1>
      <Button type='primary' onClick={handleAdd}>
        count 数值 -1
      </Button>
      <Tag color='#2db7f5'>count: {state.count}</Tag>
    </div>
  )
}

export default UseReducerChild1
