import { reqGet, reqPost } from '@/http/request'
import type { PromiseType } from '@/types/api'
import type { IDept, IDeptSearchParams } from '@/types/api/department'

enum API {
  DEPT_LIST = '/dept/list',
  DEPT_CREATE = '/dept/create',
  DEPT_EDIT = '/dept/edit',
  DEPT_DELETE = '/dept/delete'
}

/*
  reqGet<类型参数1 类型参数2>
    参数1：接口数据返回的data的类型
    参数2：接口传参类型

  PromiseType<类型参数3>>
    参数3：接口数据返回的data的类型
*/

// 获取部门列表
export const getDeptList = (param?: IDeptSearchParams): PromiseType<IDept[]> => {
  return reqGet<IDept[], IDeptSearchParams>(API.DEPT_LIST, param)
}

// 添加部门
export const postCreateDept = (param: IDept): PromiseType<string> => {
  return reqPost<string, IDept>(API.DEPT_CREATE, param)
}

// 修改部门
export const postUpdateDept = (param: IDept): PromiseType<string> => {
  return reqPost<string, IDept>(API.DEPT_EDIT, param)
}

// 删除部门
export const postDeleteDept = (param: { _id: string }): PromiseType<string> => {
  return reqPost<string, { _id: string }>(API.DEPT_DELETE, param)
}
