import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'

import moboxStores from './index'

/* 根据 RootStore 来实现参数的自动获取和返回值的自动推导 */
function useStore<T extends typeof moboxStores, V extends keyof T>(name: V): T[V] {
  const store = useContext(MobXProviderContext) as T
  return store[name]
}

export default useStore
