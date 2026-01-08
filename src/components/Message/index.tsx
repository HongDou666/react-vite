import ReactDom from 'react-dom/client'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import classnames from 'classnames'

import moduleScss from './index.module.scss'

interface MessageType {
  messageContainer: HTMLDivElement
  root: ReactDom.Root
}

/* 记录容器和根组件的关系 */
const messageList: MessageType[] = []
/* 图标类型列表 */
const iconTypeList = {
  success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  error: <CloseCircleOutlined style={{ color: '#f5222d' }} />,
  info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
  warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
}

const Message: React.FC<ToShowParamsType> = ({ title, type = 'success' }) => {
  return (
    <>
      <div>
        {iconTypeList[type]}
        {title}
      </div>
    </>
  )
}

window.toShow = (
  value: ToShowParamsType = {
    title: '消息提示',
    type: 'success',
    duration: 3
  }
) => {
  // 1. 创建容器元素
  const messageContainer = document.createElement('div')
  // 2. 设置样式
  messageContainer.className = classnames(moduleScss.message, 'flex-center')
  // 3. 设置位置
  messageContainer.style.top = `${messageList.length * 50 + 20}px`
  // 4. 插入到 body 中
  document.body.appendChild(messageContainer)
  // 5. 容器如何关联 容器注册成根组件
  const root = ReactDom.createRoot(messageContainer)
  // 6. 渲染组件到容器中
  root.render(<Message {...value} />)
  // 7. 记录容器和根组件的关系
  messageList.push({
    messageContainer,
    root
  })
  // 8. 定时器移除组件和容器
  setTimeout(() => {
    const item = messageList.find((item) => item.messageContainer === messageContainer)!
    item.root.unmount() // 卸载组件
    document.body.removeChild(item.messageContainer) // 移除容器
    messageList.splice(messageList.indexOf(item), 1) // 移除记录
    // 重新计算位置 保证有个过渡的效果
    messageList.forEach((item, index) => {
      item.messageContainer.style.top = `${index * 50 + 20}px`
    })
  }, value.duration! * 1000)
}

export default Message
