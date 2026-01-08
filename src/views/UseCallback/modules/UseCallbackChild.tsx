interface PropsType {
  onChange: (event) => void
}

const UseCallbackChild: React.FC<PropsType> = ({ onChange }) => {
  console.log('子组件 - 渲染了')

  return (
    <div>
      <Button type='primary' onClick={(event) => onChange(event)}>
        子组件
      </Button>
    </div>
  )
}

export default memo(UseCallbackChild)
