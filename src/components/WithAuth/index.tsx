import { Navigate } from 'react-router-dom'

import Redirect from '@/components/Redirect'
import { useAuthorization } from '@/utils'

/**
 * 高阶组件
 * @description token校验高阶组件
 * @param Component 要加载的组件
 * @returns 新组件
 */
const withAuth = (Component) => {
  return function AuthWrapper(props: React.PropsWithChildren) {
    const [getToken] = useAuthorization()
    const isAuth = getToken()

    return <>{isAuth ? <Component {...props} /> : <Redirect to='/' replace={false} />}</>
  }
}

export default withAuth

/* 有 token 则展示原组件 否则直接重定向到 / 页面 */
export const AuthCompontent: React.FC<React.PropsWithChildren> = (props) => {
  const [getToken] = useAuthorization()

  /* 写法1: 使用封装的 Redirect 组件  */
  return getToken() ? props.children : <Redirect to='/' replace={false} />

  /* 写法2: 使用路由 Navigate 组件  */
  // return getToken() ? props.children : <Navigate to='/' replace={false} />
}
