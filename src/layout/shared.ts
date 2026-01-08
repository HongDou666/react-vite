import type { SyncRoute } from '@/routes/interface'

/* 递归获取路由对象 */
export const searchRoute: any = (path: string, routes: SyncRoute.RoutersProps[]) => {
  for (const item of routes) {
    if (item.path === path) return item
    if (item.children) {
      const res = searchRoute(path, item.children)
      if (res) return res
    }
  }
}
