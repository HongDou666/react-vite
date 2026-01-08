/*
	1. 该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
	2. reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
*/
import { fromJS } from 'immutable'

import { CINEMALIST, CINEMALISTPROMISE, DECREMENT, INCREMENT } from '../constant'

type PreStateType = {
  value: number
  cinemaList: any[]
}

/* 初始化状态 */
const initState: PreStateType = {
  value: 0,
  cinemaList: []
}

export default function countReducer(preState = initState, action) {
  /* 从action对象中获取：type、data */
  const { type, data } = action

  /* 此处用的是浅拷贝（扩展运算符）*/
  // const newState = { ...preState }

  const newState = fromJS(preState)

  /* 根据type决定如何加工数据 */
  switch (type) {
    case INCREMENT: // 如果是加
      // newState.value += data
      // return newState
      return newState.set('value', newState.get('value') + data).toJS()

    case DECREMENT: // 如果是减
      // newState.value -= data
      // return newState
      const currentValue = newState.get('value') as number
      return newState.set('value', currentValue - data).toJS()

    case CINEMALIST: // 获取电影列表 redux-thunk
      // newState.cinemaList = data
      // return newState
      return newState.set('cinemaList', data).toJS()

    case CINEMALISTPROMISE: // 获取电影列表 redux-promise
      // newState.cinemaList = data
      // return newState
      return newState.set('cinemaList', data).toJS()

    default:
      return preState
  }
}
