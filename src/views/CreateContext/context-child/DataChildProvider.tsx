import type { FC, PropsWithChildren } from 'react'

import { DataChildContext } from './dataChildContext'

const DataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    name: '麦克',
    age: 18,
    cityList: [
      { name: '北京', code: 100000 },
      { name: '上海', code: 200000 }
    ]
  })

  return (
    <>
      {/* 通过 Context 提供相关的状态和方法给子组件 */}
      <DataChildContext.Provider
        value={{
          userInfo,
          setUserInfo
        }}>
        {children}
      </DataChildContext.Provider>
    </>
  )
}

export default DataProvider
