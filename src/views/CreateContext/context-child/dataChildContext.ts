import { createContext } from 'react'
/*
  useContext 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。设计的目的就是解决组件树间数据传递的问题

  如果使用多个Context，那么需要注意，如果使用的值是相同的，那么会覆盖
*/

export type DataChildContextType = {
  userInfo: {
    name: string
    age: number
    cityList: { name: string; code: number }[]
  }
  setUserInfo: (arg: DataChildContextType['userInfo']) => void
}

/* 创建 Context 填入默认值（任何一个 js 变量） */
export const DataChildContext = createContext<DataChildContextType>({
  userInfo: {
    name: '张三',
    age: 20,
    cityList: []
  },
  setUserInfo: () => {}
})

/**
 * 主题 Hook 用于在组件中获取和操作主题相关的状态和方法
 *
 * @returns DataChildContextType 主题上下文对象
 * @throws Error 如果在 ThemeProvider 外部使用则抛出错误
 */
export function useChildData() {
  const data = useContext(DataChildContext)

  if (!data) {
    throw new Error('useData must be used within a ThemeProvider')
  }

  return data
}
