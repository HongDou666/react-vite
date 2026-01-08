import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CityType } from './city/type'
import type { RoleType } from './role/type'
import type { UserType } from './user/type'
import useCityStore from './city'
import useRoleStore from './role'
import useUserStore from './user'

const useBoundStore = create<RoleType & CityType & UserType>()(
  persist(
    (...args) => ({
      ...useRoleStore(...args),
      ...useCityStore(...args),
      ...useUserStore(...args)
    }),
    {
      name: 'zustand-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        roleList: state.roleList,
        listData: state.listData
      })
    }
  )
)

export default useBoundStore
