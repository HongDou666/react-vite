import { Helmet } from 'react-helmet'
import { useRouteLoaderData } from 'react-router-dom'

import { usePrevious, useRoute } from '@/routes/hooks/use-route'
import { useAuthorization } from '@/utils'

import BaseLayout from './layout'

interface useRouteLoaderDataType {
  menuList: any[]
  menuPathList: string[]
  buttonList: string[]
}

/* 这里手动模拟白名单 如果URL 能够匹配上 以下正则 均可放行 */
const routerRegex = [/^\/dashboard/, /^\/keep-alive-demo/]

/**
 * 处理路由切换逻辑
 *
 * @param to 目标路由
 * @param from 来源路由
 * @returns 返回路由跳转信息或 null
 */
function handleRouteSwitch(to: Router.Route, from: Router.Route | null) {
  // 处理包含 href 的路由（外链跳转）
  if (to?.handle?.href) {
    window.open(to.handle.href, '_blank')

    return { path: from?.fullPath as string, replace: true }
  }

  return null
}

function createRouteGuard(
  to: Router.Route,
  previousRoute: Router.Route | null,
  menuPathList: string[],
  getToken: () => string | null
) {
  const loginRoute = '/login'
  const notFoundRoute = '/error/404'
  const rootRoute = '/'

  const isLogin = !!getToken()

  if (!isLogin) {
    // 未登录, 但是在白名单内的路由则放行 (常量路由 无需登录即可访问)
    if (to.data?.meta?.constant) {
      return null
    }

    // 未登录用户跳转到登录页，并携带重定向参数
    const query = to.fullPath
    const location = `${loginRoute}?redirect=${query}`
    return location
  }

  /* 路由拦截 没有权限不能访问 跳转404 */
  if (
    !(
      menuPathList.includes(to.pathname) ||
      rootRoute === to.pathname ||
      routerRegex.some((item) => item.test(to.pathname))
    )
  ) {
    return notFoundRoute
  }

  // 权限验证通过，处理路由切换
  return handleRouteSwitch(to, previousRoute)
}

function AppLayout() {
  // 用于跟踪路由变化，避免重复执行守卫逻辑
  const routeId = useRef<string>('')

  // 存储路由守卫返回的跳转目标
  const location = useRef<string | { path: string; replace: boolean } | null>(null)

  // 获取当前路由信息
  const route = useRoute()
  // 获取前一个的路由信息
  const previousRoute = usePrevious(route)
  const { data, id, pathname } = route

  const [getToken] = useAuthorization()
  const routerData = useRouteLoaderData('layout') as useRouteLoaderDataType
  const { menuPathList } = routerData

  /* 
    页面切换 设置进度条动画 
    因为我们在App.tsx 中设置了进度条动画，所以这里就不需要重复设置了 <ProgressBar/>
    useEffect(() => {
      window.NProgress?.done?.()
      return () => {
        window.NProgress?.start?.()
      }
    }, [pathname])
  */

  // 路由变化时执行守卫逻辑
  if (routeId.current !== id) {
    routeId.current = id
    location.current = createRouteGuard(route, previousRoute, menuPathList, getToken)
  }

  // 根据守卫结果决定渲染内容
  return location.current ? (
    // 需要跳转的情况
    typeof location.current === 'string' ? (
      <Navigate to={location.current} />
    ) : (
      <Navigate replace={location.current.replace} to={location.current.path} />
    )
  ) : (
    // 允许访问，渲染子路由
    <>
      {/* 设置网站标题 */}
      <Helmet title={(data as { title: string })?.title || '晚风 React'} />
      <BaseLayout></BaseLayout>
    </>
  )
}

export default AppLayout
