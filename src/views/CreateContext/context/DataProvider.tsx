import type { FC, PropsWithChildren } from 'react'

import { DataContext } from './dataContext'

const DataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [windowPx, setWindowPx] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    name: '蛟龙-9800'
  })

  return (
    <>
      <Button
        type='primary'
        onClick={() => {
          setWindowPx({
            ...windowPx,
            name: windowPx.name === '蛟龙-9800' ? '麒麟-10000' : '蛟龙-9800'
          })
        }}>
        改变芯片名称
      </Button>
      <h3>我是 A 组件</h3>
      <h4>我的用户名是: {windowPx.name}</h4>

      {/* 通过 Context 提供相关的状态和方法给子组件 */}
      <DataContext.Provider
        value={{
          windowPx,
          setWindowPx
        }}>
        {children}
      </DataContext.Provider>
    </>
  )
}

export default DataProvider
