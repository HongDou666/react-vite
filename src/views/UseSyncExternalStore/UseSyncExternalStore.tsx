/*
  useSyncExternalStore 是 React 18 引入的一个 Hook，用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用

  场景
    1. 订阅外部 store 例如(redux,mobx,Zustand,jotai)  vue的 vuex pinia
    2. 订阅浏览器API 例如(online,storage,location, history hash)等
    3. 抽离逻辑，编写自定义hooks
    4. 服务端渲染支持
*/

import { useStorage } from './hooks/useStorage'

const USE_COUNT = 'use-sync-external-store'

const UseSyncExternalStore: React.FC = () => {
  const [data, setStorage] = useStorage<string, number>(USE_COUNT, 50)

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setStorage(data + 1)
        }}>
        数值 +1
      </Button>
      <Button
        type='primary'
        onClick={() => {
          setStorage(data - 2)
        }}>
        数值 -1
      </Button>

      <Tag color='#2db7f5'>use-sync-external-store: {data}</Tag>
    </div>
  )
}

export default UseSyncExternalStore
