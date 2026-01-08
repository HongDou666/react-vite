import { withLazyLoad } from '@/components/WithLazyLoad'

import * as actions from '../action'
import type { RoutesPageType } from '../interface'

/* 编译时态读取目录结构（page.ts）*/
const routesPage: Record<string, RoutesPageType> = import.meta.glob(
  [
    '@/views/**/page.ts',
    '!@/views/Dashboard/page.ts', // 注意: Dashboard 页面 已经在 routes.tsx 中已经定义了 所以此处排除掉 无需动态添加
    '!@/views/DynamicRoute/page.ts', // 注意: 此处为演示动态添加路由故意排除掉
    '!@/views/KeepAliveDemo[1-3]/page.ts' // 注意: 此处为演示路由缓存故意排除掉
  ],
  {
    eager: true, // 默认以懒加载形式引入 取消为false
    import: 'default'
  }
)

const dynamicRoute: RoutesPageType[] = []

for (const key in routesPage) {
  const item = routesPage[key]
  const url = `${key.replace('/page.ts', '')}/${item.key}`
  const routeObj: RoutesPageType = {
    path: item.path,
    id: item.key!,
    loader: () => ({
      title: (item.title || item.label)!,
      sort: item.sort!,
      meta: item?.meta || null
    }),
    element: lazy(() => import(/* @vite-ignore */ url))
  }
  if (item.action) {
    routeObj.action = actions[item.action as any]
  }
  item.meta && (routeObj.meta = item.meta)
  dynamicRoute.push(routeObj)
}

export default dynamicRoute

const dynamicRouteComp: RoutesPageType[] = []
const modulesDynamicRoute: any = import.meta.glob(['@/views/DynamicRoute/DynamicRoute.tsx'])
const modulesDynamicPage = import.meta.glob(['@/views/DynamicRoute/page.ts'], {
  eager: true, // 默认以懒加载形式引入 取消为false
  import: 'default'
})
for (const key in modulesDynamicRoute) {
  // 找到最后一个斜杠的索引
  const lastSlashIndex = key.lastIndexOf('/')
  // 使用 substring 方法截取从开头到最后一个斜杠的部分
  const result = key.substring(0, lastSlashIndex + 1)
  const item: Record<string, any> = modulesDynamicPage[`${result}page.ts`]!
  const LazyLoadComponent = withLazyLoad(lazy(modulesDynamicRoute[key]))
  dynamicRouteComp.push({
    path: item.path,
    id: item.key!,
    loader: () => ({
      title: (item.title || item.label)!,
      sort: item.sort!
    }),
    element: <LazyLoadComponent />
  })
}

/* 计算出要添加的动态路由 */
export function getDynamicRoute() {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(dynamicRouteComp)
      clearTimeout(timer)
    }, 300)
  })
}
