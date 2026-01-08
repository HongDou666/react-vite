import { IUser } from '@/types/api/user'

export interface UserType {
  userInfo: IUser
  updateUserInfo: (userInfo: IUser) => void
}
