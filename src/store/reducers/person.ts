import { produce } from 'immer'

import { ADD_CITY, ADD_PERSON, CHANGE_CINEMA_LIST } from '../constant'

type PersonListType = {
  id: string
  name: string
  age: number
}
interface PreStateType {
  personList: PersonListType[]
  sagaCinemaList: any[]
  cityInfo: { name: string; cityList: { title: string }[] }
}
interface ActionType {
  type: string
  data?: any
}

/* 初始化数据 */
const initState = {
  personList: [{ id: '001', name: '托比', age: 20 }],
  sagaCinemaList: [],
  cityInfo: {
    name: '苏州',
    cityList: [
      {
        title: '姑苏区'
      },
      {
        title: '吴中区'
      }
    ]
  }
}

export default function personReducer(preState: PreStateType = initState, action: ActionType) {
  /* 从 action 对象中获取：type、data */
  const { type, data } = action

  const newState = { ...preState }

  switch (type) {
    case ADD_PERSON: // 添加人
      newState.personList = [data, ...newState.personList]
      return newState

    case CHANGE_CINEMA_LIST: // 改变电影列表 redux-saga
      newState.sagaCinemaList = [...data]
      return newState

    case ADD_CITY: // 添加城市
      newState.cityInfo.cityList = [...newState.cityInfo.cityList, data]
      return newState

    default:
      return preState
  }
}

/*
  Redux + Immer 结合使用 (推荐写法)
  参考文献: https://immerjs.github.io/immer/zh-CN/example-setstate/#redux--immer

  const personReducer = produce((preState: PreStateType = initState, action: ActionType) => {
    const { type, data } = action

    switch (type) {
      case ADD_PERSON: // 添加人
        preState.personList = [data, ...preState.personList]
        return preState

      case CHANGE_CINEMA_LIST: // 改变电影列表 redux-saga
        preState.sagaCinemaList = [...data]
        return preState

      case ADD_CITY: // 添加城市
        preState.cityInfo.cityList = [...preState.cityInfo.cityList, data]
        return preState

      default:
        return preState
    }
  })

  export default personReducer
*/
