import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit'

/**
 * 创建一个包含同步 reducer 和异步能力的 route 管理 slice，具有自动生成 selectors、简化 reducer 写法的效果
 *
 * buildCreateSlice: RTK v2 替代 createSlice 的增强版; 构建增强版 createSlice，可按需注入 helpers（同步/异步）
 *
 * asyncThunkCreator: 让 createSlice 内部可以直接创建 create.asyncThunk()（内部等同 createAsyncThunk）, 用于在 slice 内生成 async thunk 的工厂，等价于 createAsyncThunk 的升级版
 */
export const createAppSlice = buildCreateSlice({
  creators: {
    asyncThunk: asyncThunkCreator
  }
})
