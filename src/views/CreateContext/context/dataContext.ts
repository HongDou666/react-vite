import { createContext } from 'react'
/*
  useContext 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。设计的目的就是解决组件树间数据传递的问题

  如果使用多个Context，那么需要注意，如果使用的值是相同的，那么会覆盖
*/

export type DataContextType = {
  windowPx: {
    width: number
    height: number
    name: string
  }
  setWindowPx: (arg: DataContextType['windowPx']) => void
}

/* 创建 Context 填入默认值（任何一个 js 变量） */
export const DataContext = createContext<DataContextType>({
  windowPx: {
    width: window.innerWidth,
    height: window.innerHeight,
    name: '苹果-M2'
  },
  setWindowPx: () => {}
})

/**
 * 主题 Hook 用于在组件中获取和操作主题相关的状态和方法
 *
 * @returns DataContextType 主题上下文对象
 * @throws Error 如果在 ThemeProvider 外部使用则抛出错误
 */
export function useData() {
  const data = useContext(DataContext)

  if (!data) {
    throw new Error('useData must be used within a ThemeProvider')
  }

  return data
}
