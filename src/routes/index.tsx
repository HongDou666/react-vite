import { Suspense } from 'react'
import { createBrowserRouter, createHashRouter, RouteObject } from 'react-router-dom'

import SuspenseLoading from '@/components/SuspenseLoading'

import type { SyncRoute } from './interface/index'
import { RouteTable } from './routes'

const syncRouter = (table: SyncRoute.RoutersProps[]): RouteObject[] => {
  const routeTable: RouteObject[] = []
  table.forEach((route: SyncRoute.RoutersProps | Record<string, any>) => {
    const { isLink, unLazy, meta = { keepAlive: false, isValidateToken: false } } = route
    routeTable.push({
      ...route,
      element:
        isLink || unLazy || meta?.isValidateToken || meta?.keepAlive ? (
          route.element
        ) : (
          <Suspense fallback={<SuspenseLoading></SuspenseLoading>}>
            <route.element />
          </Suspense>
        ),
      children: route.children && syncRouter(route.children)
    })
  })
  return routeTable
}

const routes = syncRouter(RouteTable)

const reactRouter = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
    v7_fetcherPersist: true,
    v7_skipActionErrorRevalidation: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true
  }
})

/*
  const RouteTable: SyncRoute.RoutersProps[] = [
    {...},
    {...},
  ]
  const Router = () => useRoutes(syncRouter(RouteTable))
*/

export {
  // Router
  reactRouter as router
}

/* 这里返回静态路由 为之后的动态添加路由做准备 */
export default routes
