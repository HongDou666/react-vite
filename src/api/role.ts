import { reqGet, reqPost } from '@/http/request'
import type { PromiseType } from '@/types/api'
import type {
  IPermission,
  IRole,
  IRoleCreateParams,
  IRoleEditParams,
  IRoleSearchParams,
  ResultData
} from '@/types/api/role'

enum API {
  ROLES_LIST = '/roles/list',
  ROLES_DELETE = '/roles/delete',
  ROLES_UPDATE_PERMISSION = '/roles/update/permission',
  ROLES_CREATE = '/roles/create',
  ROLES_EDIT = '/roles/edit',
  ROLES_ALLLIST = '/roles/allList'
}

/*
  reqGet<类型参数1 类型参数2>
    参数1：接口数据返回的data的类型
    参数2：接口传参类型

  PromiseType<类型参数3>>
    参数3：接口数据返回的data的类型
*/

// 获取角色列表
export const getRoleList = (params: IRoleSearchParams): PromiseType<ResultData<IRole>> => {
  return reqGet<ResultData<IRole>, IRoleSearchParams>(API.ROLES_LIST, params)
}

// 删除角色
export const postDeleteRole = (params: { _id: string }): PromiseType<string> => {
  return reqPost<string, { _id: string }>(API.ROLES_DELETE, params)
}

// 更新权限
export const postUpdatePermission = (params: IPermission): PromiseType<string> => {
  return reqPost<string, IPermission>(API.ROLES_UPDATE_PERMISSION, params)
}

// 创建角色
export const postCreateRole = (params: IRoleCreateParams): PromiseType<string> => {
  return reqPost<string, IRoleCreateParams>(API.ROLES_CREATE, params)
}

// 更新角色
export const postUpdateRole = (params: IRoleEditParams): PromiseType<string> => {
  return reqPost<string, IRoleEditParams>(API.ROLES_EDIT, params)
}

// 获取所有角色列表
export const getAllRoleList = (): PromiseType<IRole[]> => {
  return reqGet<IRole[]>(API.ROLES_ALLLIST)
}
