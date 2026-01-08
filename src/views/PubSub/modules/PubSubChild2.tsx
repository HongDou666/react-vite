import { useEffect, useRef, useState } from 'react'
import PubSub from 'pubsub-js'

const PubSubChild2 = () => {
  const pubsubTokenRef = useRef(null)
  const [dataInfo, setDataInfo] = useState({
    name: '寒冰',
    address: '江苏',
    phone: '158000000'
  })

  const getData = (e: Event) => {
    console.log(e.params)
  }

  useEffect(() => {
    /* 事件中心接收数据 */
    window.addEventListener('zqc-send', getData)

    pubsubTokenRef.current = PubSub.subscribe('pubsub-send', (value, stateObj) => {
      setDataInfo({
        ...stateObj
      })
    })
    return () => {
      window.removeEventListener('zqc-send', getData)

      PubSub.unsubscribe(pubsubTokenRef.current)
    }
  }, [])

  return (
    <div>
      <p>name : {dataInfo.name}</p>
      <p>address : {dataInfo.address}</p>
      <p>phone : {dataInfo.phone}</p>
    </div>
  )
}

export default PubSubChild2
