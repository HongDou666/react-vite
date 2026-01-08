type RolesType = {
  name: string
}

export interface RoleType {
  count: number
  roleList: RolesType[]
  pageNum: number
  listData: Record<string, any>[]
  increment: (value: number) => void
  decrement: (value: number) => void
  addRoleList: (value: RolesType) => void
  getListData: (value: any) => void
}
