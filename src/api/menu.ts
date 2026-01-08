import { reqGet, reqPost } from '@/http/request'
import type { PromiseType } from '@/types/api'
import type { ICreateMenuParams, IMenu, ISearchParams, IUpdateMenuParams } from '@/types/api/menu'

enum API {
  MENU_CREATE = '/menu/create',
  MENU_EDIT = '/menu/edit',
  MENU_LIST = '/menu/list',
  MENU_DELETE = '/menu/delete'
}

/*
  reqGet<类型参数1 类型参数2>
    参数1：接口数据返回的data的类型
    参数2：接口传参类型

  PromiseType<类型参数3>>
    参数3：接口数据返回的data的类型
*/

// 创建菜单参数
export const postMenuCreate = (param: ICreateMenuParams): PromiseType<string> => {
  return reqPost<string, ICreateMenuParams>(API.MENU_CREATE, param)
}

// 更新菜单参数
export const postMenuEdit = (param: IUpdateMenuParams): PromiseType<string> => {
  return reqPost<string, IUpdateMenuParams>(API.MENU_EDIT, param)
}

// 菜单list
export const getMenuList = (param?: ISearchParams): PromiseType<IMenu[]> => {
  return reqGet<IMenu[], ISearchParams>(API.MENU_LIST, param)
}

// 删除菜单
export const postDeleteMenu = (param: { _id: string }): PromiseType<string> => {
  return reqPost<string, { _id: string }>(API.MENU_DELETE, param)
}
