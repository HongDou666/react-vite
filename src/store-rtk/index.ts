import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
/* 引入combineReducers，用于汇总多个reducer */
import { combineReducers } from 'redux'

import appReducer, { appSlice } from './modules/app'
import asyncThunkReducer, { asyncThunkSlice } from './modules/asyncThunk'
import themeReducer, { themeSlice } from './modules/theme'
import widgetReducer, { widgetStore } from './modules/widgetStore'

// 写法1: 汇总多个reducer (combineSlices(widgetStore, ...))
const rootReducer_01 = combineSlices(widgetStore, asyncThunkSlice, themeSlice, appSlice)

// 写法2: 汇总多个reducer
const rootReducer_02 = combineReducers({
  widget: widgetReducer,
  asyncThunk: asyncThunkReducer,
  theme: themeReducer,
  app: appReducer
})

/*
  我们已经使用了 redux 创建 createStore; 就不在 main.ts 引入使用 @reduxjs/toolkit
  使用方式:
    1. 在 main.ts 中引入 store => import storeRtk from '@/store-rtk'
    2. Provider包裹 => <Provider store={store}> ... </Provider>

   补充:
   实现持久化: https://blog.csdn.net/zhenshu_guo/article/details/135187759
*/
const store = configureStore({
  /* 1.
    reducer: {
      widget: widgetReducer,
      asyncThunk: asyncThunkReducer,
      theme: themeReducer,
      app: appReducer
    }
  */

  /* 2.
    reducer: rootReducer_02
  */

  /* 3. */
  reducer: rootReducer_01
})

export type RootState = ReturnType<typeof rootReducer_01>
/* 导出store对象的类型 */
export type AppStore = typeof store
/* 导出store对象的dispatch类型 */
export type AppDispatch = AppStore['dispatch']
/* 用于表示具有特定返回类型、可以访问和操作Redux store的根状态、并且可以接受任意额外参数（在这个定义中未具体指定类型）的异步action creator */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>

export { widgetReducer, asyncThunkReducer, themeReducer, appReducer }

export default store
