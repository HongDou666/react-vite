/* 该文件用于汇总所有的reducer为一个总的reducer */

// 引入combineReducers，用于汇总多个reducer
import { combineReducers } from 'redux'

// 引入为组件服务的reducer
import { appReducer, asyncThunkReducer, themeReducer, widgetReducer } from '@/store-rtk/index'

// 引入为Count组件服务的reducer
import count from './count'
// 引入为Person组件服务的reducer
import persons from './person'

const reducerState: Record<string, any> = {
  count: count,
  persons: persons,
  widget: widgetReducer,
  asyncThunk: asyncThunkReducer,
  theme: themeReducer,
  app: appReducer
}

// 汇总所有的reducer变为一个总的reducer
export default combineReducers(reducerState)
