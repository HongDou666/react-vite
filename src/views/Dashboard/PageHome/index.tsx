import { Outlet, useOutletContext } from 'react-router-dom'

import moduleScss from './index.module.scss'

type ContextType = {
  count: number
  setCount: (number) => void
}

const PageHome = () => {
  const [count, setCount] = useState(100)

  return (
    <div className={moduleScss['page-home']}>
      PageHome <Tag color='processing'>{count}</Tag>
      {/* 父路由通常会管理状态或其他你希望与子路由共享的值。您可以根据需要创建自己的上下文提供程序 */}
      <Outlet
        context={
          {
            count,
            setCount
          } satisfies ContextType
        }
      />
    </div>
  )
}

/*
  提供一个自定义钩子
  参考文献: https://baimingxuan.github.io/react-router6-doc/hooks/use-outlet-context
*/
export function usePageHome() {
  return useOutletContext<ContextType>()
}

export default PageHome
