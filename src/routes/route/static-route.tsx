import Error404 from '@/page/Error404/Error404'
import { loginLoader } from '@/routes/loader/index'

const staticRoute = [
  {
    path: '/login',
    id: 'login',
    loader: loginLoader,
    element: lazy(() => import('@/page/Login/Login'))
  },
  {
    path: '/error/404',
    unLazy: true, // 非懒加载路由组件
    id: '404',
    loader: () => ({ title: '404' }),
    element: <Error404></Error404>
  }
]

export default staticRoute
