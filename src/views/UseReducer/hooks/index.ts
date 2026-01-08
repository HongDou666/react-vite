/*
  useReducer 钩子
  1. reducer 是一个处理函数，用于更新状态, reducer 里面包含了两个参数，第一个参数是 state，第二个参数是 action。reducer 会返回一个新的 state
  2. initialArg 是 state 的初始值
  3. init 是一个可选的函数，用于初始化 state，如果编写了init函数，则默认值使用init函数的返回值，否则使用initialArg
*/

import { nanoid } from 'nanoid'

export type PrevStatetype = typeof intialState

export const intialState = {
  count: 0,
  regions: [
    {
      id: nanoid(),
      name: '北京'
    },
    {
      id: nanoid(),
      name: '上海'
    },
    {
      id: nanoid(),
      name: '广州'
    },
    {
      id: nanoid(),
      name: '深圳'
    },
    {
      id: nanoid(),
      name: '杭州'
    }
  ]
}

/* 初始化函数 只执行一次 */
export const initFn = (state: PrevStatetype) => {
  console.log('初始化函数 只执行一次')
  return {
    ...state,
    count: state.count + Math.floor(Math.random() * 100)
  }
}

export const reducer = (prevState: PrevStatetype, action) => {
  const newstate = { ...prevState }

  switch (action.type) {
    case 'zqc-minus':
      // newstate.count--
      newstate.count = action.value
      return newstate

    case 'zqc-add':
      // newstate.count++
      newstate.count = action.value
      return newstate

    case 'ADD_REGION':
      newstate.regions = [
        ...prevState.regions,
        {
          id: nanoid(),
          name: '上海' + newstate.regions.length
        }
      ]
      return newstate

    case 'REMOVE_REGION':
      newstate.regions = action.value
      return newstate

    case 'FILTER_REGION':
      newstate.regions = prevState.regions.filter((item) => !item.name.includes(action.value))
      return newstate

    default:
      return prevState
  }
}
