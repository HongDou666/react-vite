import type { ItemType, SubMenuType } from 'antd/es/menu/interface'

// eslint-disable-next-line max-params
export function getBreadcrumbsByRoute(route: Record<string, any>, menus: ItemType[]) {
  const res: SubMenuType[] = []
  if (!Object.keys(route.loaderData).length) return res
  const sort = route.loaderData[route.matches[1]?.route.id]?.sort
  const currentMenu = menus.find((item) => item?.key === sort) as SubMenuType | undefined
  currentMenu && res.push(currentMenu as SubMenuType)
  if (currentMenu && currentMenu.children && currentMenu.children.length) {
    const currentMenu_ = currentMenu.children.find((item: any) => item?.path === route.location.pathname)
    currentMenu_ && res.push(currentMenu_ as SubMenuType)
  }

  return res
}
