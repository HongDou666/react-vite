import { StateCreator } from 'zustand'

import { getMaizuo } from '@/api/mock/index'

import type { RoleType } from './type'

const useRoleStore: StateCreator<RoleType> = (set, get, ...args) => ({
  /* 数据状态 */
  count: 10,
  roleList: [
    {
      name: '超级管理员'
    },
    {
      name: '系统管理员'
    },
    {
      name: '客户管理员'
    },
    {
      name: '普通用户'
    }
  ],
  pageNum: 0,
  listData: [],

  /* 改变数据的方法 */
  increment: (value) => set((state) => ({ count: state.count + value })),
  decrement: (value) => set((state) => ({ count: state.count - value })),
  addRoleList: (value) =>
    set((state) => ({
      count: state.roleList.push(value)
    })),
  getListData: async (value) => {
    const { node, config } = value
    try {
      const param: Parameters<typeof getMaizuo>[0] = node
      param.pageNum = get().pageNum + 1
      const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)
      const result = await res
      set({
        pageNum: get().pageNum + 1,
        listData: result.data?.films || []
      })
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }
})

export default useRoleStore
