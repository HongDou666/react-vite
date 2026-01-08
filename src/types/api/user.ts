/* 用户模块 */
export interface IUser {
  _id: string
  userId: number
  userName: string
  userEmail: string
  deptId: string
  state: number
  mobile: string
  job: string
  role: number
  roleList: string
  createId: number
  deptName: string
  userImg: string
}

export interface IPageParams {
  pageNum: number
  pageSize?: number
}

// 用户搜索参数
export interface IUserSearchParams extends IPageParams {
  userId?: number
  userName?: string
  state?: number
}

export interface ResultData<T> {
  list: T[]
  page: {
    total: number | 0
    pageNum: number
    pageSzie: number
  }
}

// 创建用户参数
export interface ICreateUserParams {
  userName: string
  userEmail: string
  mobile?: number
  deptId: string
  job?: string
  state?: number
  roleList: string[]
  userImg: string
}

// 更新用户参数
export interface IUpdateUserParams extends ICreateUserParams {
  userId: string
}
