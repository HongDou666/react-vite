import { reqGet, reqPost } from '@/http/request'
import type { PromiseType } from '@/types/api'
import type { IMenu } from '@/types/api/menu'
import type { ICreateUserParams, IUpdateUserParams, IUser, IUserSearchParams, ResultData } from '@/types/api/user'

enum API {
  USERS_ALL_LIST = '/users/all/list',
  USERS_LIST = '/users/list',
  USERS_CREATE = '/users/create',
  USERS_EDIT = '/users/edit',
  USERS_DELETE = '/users/delete',
  USERS_INFO = '/users/getUserInfo',
  USERS_POWER = '/users/getPermissionList'
}

/*
  reqGet<类型参数1 类型参数2>
    参数1：接口数据返回的data的类型
    参数2：接口传参类型

  PromiseType<类型参数3>>
    参数3：接口数据返回的data的类型
*/

// 获取用户信息
export const getUserInfo = (): PromiseType<IUser> => {
  return reqGet<IUser>(API.USERS_INFO)
}

// 获取所有用户信息
export const getAllUserList = (): PromiseType<IUser[]> => {
  return reqGet<IUser[]>(API.USERS_ALL_LIST)
}

// 获取用户列表
export const getUserList = (params: IUserSearchParams): PromiseType<ResultData<IUser>> => {
  return reqGet<ResultData<IUser>, IUserSearchParams>(API.USERS_LIST, params)
}

// 创建用户
export const postCreateUser = (params: ICreateUserParams): PromiseType<string> => {
  return reqPost<string, ICreateUserParams>(API.USERS_CREATE, params)
}

// 编辑用户
export const postEditUser = (params: IUpdateUserParams): PromiseType<string> => {
  return reqPost<string, IUpdateUserParams>(API.USERS_EDIT, params)
}

// 删除和批量删除用户
export const postDelUser = (params: { userIds: number[] }): PromiseType<string> => {
  return reqPost<string, { userIds: number[] }>(API.USERS_DELETE, params)
}

// 获取权限列表
export const getPermissionList = (): PromiseType<{ menuList: IMenu[]; buttonList: string[] }> => {
  return reqGet<{ menuList: IMenu[]; buttonList: string[] }>(API.USERS_POWER)
}
