import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

import { getMaizuo } from '@/api/mock/index'

/* 异步请求部分 前提要使用 redux-thunk中间件 */
export const fetchCinemaList = (data) => {
  return async (dispatch) => {
    const { node, config } = data
    try {
      const param: Parameters<typeof getMaizuo>[0] = node
      const result = await (getMaizuo(param, config) as ReturnType<typeof getMaizuo>)
      dispatch(setCinemaList(result.data?.films || []))
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }
}

/* 异步获取电影列表 - createAsyncThunk 方式1 */
export const getCinemaListAsync = createAsyncThunk('widget/getCinemaListAsync', async (payload: any, thunkApi) => {
  const { node, config } = payload
  try {
    const param: Parameters<typeof getMaizuo>[0] = node
    const result = await (getMaizuo(param, config) as ReturnType<typeof getMaizuo>)
    thunkApi.dispatch(setCinemaList(result.data?.films || []))
  } catch (error: any) {
    console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
  }
})

/* 异步获取电影列表 - createAsyncThunk 方式2 */
export const getCinemaListAsyncV2 = createAsyncThunk('widget/getCinemaListAsyncV2', async (payload: any) => {
  const { node, config } = payload
  try {
    const param: Parameters<typeof getMaizuo>[0] = node
    const result = await (getMaizuo(param, config) as ReturnType<typeof getMaizuo>)
    return result.data?.films || []
  } catch (error: any) {
    console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
  }
})

const initialState = {
  /* 是否初始化完成 */
  initFinish: false,
  countValue: 10,
  regionList: [
    {
      name: '北京',
      id: 1,
      children: [
        { name: '海淀', id: 10 },
        { name: '朝阳', id: 20 }
      ]
    },
    {
      name: '上海',
      id: 2,
      value: 'shanghai',
      children: [
        { name: '黄浦', id: 30 },
        { name: '静安', id: 40 }
      ]
    }
  ],
  officialPos: {
    name: '校长',
    lowerLevel: {
      name: '教务',
      lowerLevel: {
        name: '老师'
      }
    }
  },
  cinemaList: []
}

export const widgetStore = createSlice({
  name: 'widget',
  /* 初始化 state */
  initialState,
  /* 修改状态的方法 同步方法 支持直接修改 */
  reducers: {
    setInitFinish(state, action) {
      state.initFinish = action.payload
    },
    setAddCountValue(state, action) {
      state.countValue += action.payload
    },
    setSubCountValue(state, action) {
      state.countValue -= action.payload
    },
    setAddRegionList(state, action) {
      state.regionList = [...state.regionList, action.payload]
    },
    setAddAssignRegionList(state, action) {
      state.regionList[0]?.children.push(action.payload)
    },
    setLowerLevel(state, action) {
      state.officialPos.lowerLevel.lowerLevel.name = action.payload
    },
    setCinemaList(state, action) {
      state.cinemaList = action.payload
    }
  },
  /* 专门处理异步的 reducer */
  extraReducers: (builder) => {
    builder.addCase(getCinemaListAsyncV2.fulfilled, (state: any, action) => {
      state.cinemaList = action.payload
    })
  },
  selectors: {
    getOfficialPos: (widget) => widget.officialPos,
    getRegionList: (widget) => widget.regionList
  }
})

/* 解构出来 selector 函数 */
export const { getOfficialPos, getRegionList } = widgetStore.selectors

// 计算属性选择器
export const regionListInfo = createSelector([getRegionList], (value) => {
  return {
    item: value[0]
  }
})

/* 解构出来 actionCreater 函数 */
const {
  setInitFinish,
  setAddCountValue,
  setSubCountValue,
  setAddRegionList,
  setAddAssignRegionList,
  setLowerLevel,
  setCinemaList
} = widgetStore.actions

/* 获取 reducer */
const reducer = widgetStore.reducer

/* 以按需导出的方式导出 actionCreater */
export { setInitFinish, setAddCountValue, setSubCountValue, setAddRegionList, setAddAssignRegionList, setLowerLevel }

/* 以默认导出的方式导出reducer */
export default reducer
