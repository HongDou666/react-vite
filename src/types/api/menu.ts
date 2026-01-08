/* 菜单模块 */

// 创建菜单参数
export interface ICreateMenuParams {
  menuName: string // 菜单名称
  icon?: string // 菜单图标
  path: string // 菜单路径
  menuType: number // 菜单类型 1:菜单 2:按钮 3:页面
  menuCode: string // 菜单权限标示
  parentId: string // 父级菜单id
  component: string // 组件名称
  menuStatus: number // 菜单状态 1:启用 2:禁用
}

// 更新菜单参数
export interface IUpdateMenuParams extends ICreateMenuParams {
  _id: string
}

// 菜单list
export interface IMenu extends ICreateMenuParams {
  _id: string
  createTime: string
  buttons?: IMenu[]
  children?: IMenu[]
}

// 搜索参数
export interface ISearchParams {
  menuName: string
  menuState: number
}
