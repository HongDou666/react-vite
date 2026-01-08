import { createContext, useContext } from 'react'
import { useMatches, useRouteError } from 'react-router-dom'
import type { MenuProps } from 'antd'

import { parseQuery } from './query'

type MenuItem = Required<MenuProps>['items'][number]

type RouteContextType = {
  routes: MenuItem[]
  route: Record<string, any>
}

export const RouteContext = createContext<RouteContextType | null>(null)

export function useRoute() {
  const route = useContext(RouteContext)
  if (!route) {
    throw new Error('useRouter must be used within a Provider')
  }

  return route
}

function getCatchAllParam(str: string | undefined) {
  if (!str) return null
  // \[\.\.\.(\w+)\] 用来匹配形如 [...slug]
  // (\w+) 意味着捕获“字母、数字或下划线”组成的部分
  const match = str.match(/\[\.\.\.(\w+)\]/)
  return match ? match[1] : null
}

/** 获取路由参数 */
function getParams(
  params: Record<string, string> | undefined,
  id: string
): Record<string, string | string[]> | undefined {
  if (!params?.['*']) return params

  const lastName = id.split('_').at(-1)
  const catchAllParam = getCatchAllParam(lastName)
  if (catchAllParam) {
    return { [catchAllParam]: params['*'].split('/') }
  }
  return params
}

/** - 获取路由信息 */
export function useRouteInfo<
  T = unknown,
  Q extends Record<string, string> | null = Record<string, string>,
  P extends Record<string, string | string[]> = Record<string, string | string[]>
>() {
  // 获取当前路由的所有嵌套路由
  const matches = useMatches()
  // console.log('matches', matches);

  // 获取最后一个路由
  const routes = matches.at(-1) as any
  // console.log('routes', routes);

  // 获取当前路由信息
  const { hash, pathname, search } = useLocation()
  // console.log({ hash, pathname, search });

  // 拼接完整的路径
  const fullPath = pathname + search + hash
  // console.log('fullPath', fullPath);

  // 解析查询字符串为对象
  const query = parseQuery(search) as Q
  // console.log('query', query);

  // 捕获路由错误
  const error = useRouteError() as Error | null

  return useMemo(
    () => ({
      ...routes,
      error,
      fullPath,
      hash,
      matched: matches.slice(1),
      params: getParams(routes.params as Record<string, string>, routes.id) as P,
      pathname,
      query,
      redirect: null,
      search
    }),
    [fullPath]
  )
}
