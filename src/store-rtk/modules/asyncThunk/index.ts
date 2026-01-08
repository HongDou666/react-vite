import type { PayloadAction } from '@reduxjs/toolkit'
import { asyncThunkCreator, buildCreateSlice, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

import { getMaizuo } from '@/api/mock/index'
import { createAppSlice } from '@/store-rtk/createAppSlice'

interface InitialStateType {
  cinemaList: any[]
  cacheRoutes: string[]
}
type CinemaListType = InitialStateType['cinemaList']

const initialState: InitialStateType = {
  cinemaList: [],
  cacheRoutes: []
}

export const asyncThunkSlice = createAppSlice({
  name: 'asyncThunk',
  initialState,
  reducers: (create) => ({
    addCacheRoutes: create.reducer((state, { payload }: PayloadAction<string>) => {
      state.cacheRoutes.push(payload)
    }),
    setCinemaListAsync: create.asyncThunk<CinemaListType, any>(
      /*
        create.asyncThunk<CinemaListType, any>
        参数1: 代表 return 返回结果的类型 
        参数2: 代表传递过来的参数类型 与下面 data类型 一致
      */
      async (data) => {
        const { node, config } = data
        try {
          const param: Parameters<typeof getMaizuo>[0] = node
          const result = await getMaizuo(param, config)
          return result.data?.films || []
        } catch (error) {
          console.error(error)
          return [] // ❗ 必须返回一个符合类型的值
        }
      },
      {
        fulfilled: (state, action) => {
          state.cinemaList = action.payload
        }
      }
    )
  }),
  selectors: {
    cinemaList: (state) => state.cinemaList
  }
})

/* 解构出来 selector 函数 */
export const { cinemaList } = asyncThunkSlice.selectors

export const getCinemaList = createSelector([cinemaList], (value) => {
  return {
    list: cinemaList
  }
})

export const { setCinemaListAsync, addCacheRoutes } = asyncThunkSlice.actions

export default asyncThunkSlice.reducer // 默认导出 reducer
