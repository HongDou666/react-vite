import { produce } from 'immer'
import { StateCreator } from 'zustand'

import type { CityType } from './type'

const initialState = {
  citys: [
    {
      name: '洛杉矶'
    },
    {
      name: '旧金山'
    },
    {
      name: '纽约'
    },
    {
      name: '芝加哥'
    }
  ],
  deep: {
    nested: {
      obj: { count: 100 }
    }
  }
}

const useCityStore: StateCreator<CityType> = (set, get, ...args) => ({
  ...initialState,

  /* zustand 使用 Immer 来更新嵌套状态 https://zustand-cn.js.org/guides/updating-state#%E4%BD%BF%E7%94%A8-immer */
  normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),
  immerInc: () =>
    set(
      produce((state) => {
        ++state.deep.nested.obj.count
      })
    ),

  addCitys: (value) =>
    set(
      (state) => {
        return {
          citys: [...state.citys, value]
        }
      }
      /*
        produce((state) => {
          state.citys = [...state.citys, value]
        })
      */
    ),
  reset: () => {
    set(initialState)
  }
})

export default useCityStore
