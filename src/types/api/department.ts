/* 部门模块 */
export interface IDeptSearchParams {
  deptName?: string
}
export interface IDept {
  _id: string
  createTime: string
  updateTime: string
  deptName: string
  parentId: string
  userName: string
  children: IDept[]
}
