import { message } from 'antd'

interface PropsType {
  forwardRefComp: React.Ref<HTMLButtonElement>
  name: string
}

const ForwardRefChild4: React.FC<PropsType> = (props) => {
  const handleClick = () => {
    message.success(`ForwardRefChild4 按钮点击: ${props.name}`)
  }

  return (
    <div>
      <Button ref={props.forwardRefComp} type='primary' onClick={handleClick}>
        ForwardRefChild4 按钮
      </Button>
    </div>
  )
}

export default ForwardRefChild4
