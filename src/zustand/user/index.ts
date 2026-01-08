import { StateCreator } from 'zustand'

import { IUser } from '@/types/api/user'

import type { UserType } from './type'

const initialState = {
  userInfo: {
    _id: '',
    userId: 0,
    userName: '',
    userEmail: '',
    deptId: '',
    state: 0,
    mobile: '',
    job: '',
    role: 0,
    roleList: '',
    createId: 0,
    deptName: '',
    userImg: ''
  }
}

const useUserStore: StateCreator<UserType> = (set, get, ...args) => ({
  ...initialState,

  updateUserInfo: (userInfo: IUser) => set({ userInfo })
})

export default useUserStore
