import PubSub from 'pubsub-js'

const PubSubChild1 = () => {
  /* 添加事件中心 */
  const zqcSend = new Event('zqc-send')

  const nodeData = {
    name: '晚风',
    address: '北京',
    phone: '13800000000'
  }

  const handleSend = () => {
    PubSub.publish('pubsub-send', nodeData)
  }

  const handleSend1 = () => {
    zqcSend.params = {
      name: '2024-12-29 龙年大吉'
    }
    window.dispatchEvent(zqcSend) // 派发事件
  }

  return (
    <div>
      <Button type='primary' onClick={handleSend}>
        发送数据-pubsub
      </Button>

      <Button type='primary' onClick={handleSend1}>
        发送数据-Event
      </Button>
    </div>
  )
}

export default PubSubChild1
