/* 角色模块 */

export interface IRole {
  _id: string
  roleName: string
  remark: string
  permissionList: {
    checkedKeys: string[]
    halfCheckedKeys: string[]
  }
  createTime: string
  updateTime: string
}

export interface IPageParams {
  pageNum: number
  pageSize?: number
}

export interface IRoleSearchParams extends IPageParams {
  roleName?: string
}

export interface IRoleCreateParams {
  roleName: string
  remark: string
}

export interface IRoleEditParams extends IRoleCreateParams {
  _id: string
}

export interface IPermission {
  _id: string
  permissionList: {
    checkedKeys: string[]
    halfCheckedKeys: string[]
  }
}

export interface ResultData<T> {
  list: T[]
  page: {
    total: number | 0
    pageNum: number
    pageSzie: number
  }
}
