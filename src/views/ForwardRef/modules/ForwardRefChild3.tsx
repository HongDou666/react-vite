import { message } from 'antd'

function ForwardRefChild3(props, ref) {
  const btnDom = useRef(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [data, setData] = useState({
    name: 'name',
    label: 'label',
    number: 100
  })
  const count = useRef(data.number)

  const reset = () => {
    setData({
      name: 'name',
      label: 'label',
      number: 100
    })
  }

  const openMessage = () => {
    const number = data.number + 1
    count.current = number
    setData({
      ...data,
      number
    })
    messageApi.open({
      type: 'success',
      content: '我是子组件中的方法: ' + number
    })
  }

  /*
    useImperativeHandle: 子组件对外暴露内部的 数据 和 方法
    执行时机[第三个参数]:
     1. 如果不传入第三个参数，那么useImperativeHandle会在组件挂载时执行一次，然后状态更新时，都会执行一次
     2. 如果传入第三个参数，并且是一个空数组，那么useImperativeHandle会在组件挂载时执行一次，然后状态更新时，不会执行
     3. 如果传入第三个参数，并且有值，那么useImperativeHandle会在组件挂载时执行一次，然后会根据依赖项的变化，决定是否重新执行
  */
  useImperativeHandle(ref, () => {
    return {
      reset, // 子组件中的重置方法
      btnDom: btnDom.current, // 子组件中的 Button 元素
      openMessage,
      getInfo: () => ({
        data,
        count: count.current // 实时数据
      })
    }
  })

  return (
    <div>
      {contextHolder}
      <Button ref={btnDom} type='primary' onClick={openMessage}>
        子组件弹出提示 + {data.number}
      </Button>
    </div>
  )
}

export default forwardRef(ForwardRefChild3)
