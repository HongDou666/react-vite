import { getMaizuo } from '@/api/mock/index'

/* 该文件专门为Count组件生成action对象 */
import { CHANGE_CINEMA_LIST, CINEMALIST, CINEMALISTPROMISE, DECREMENT, INCREMENT } from '../constant'

// 同步action，就是指action的值为Object类型的一般对象
export const increment = (data) => ({ type: INCREMENT, data })
export const decrement = (data) => ({ type: DECREMENT, data })
export const cinemaList = (data) => ({ type: CINEMALIST, data })
export const cinemaListPromise = (data) => ({ type: CINEMALISTPROMISE, data })
export const cinemaListSaga = (data) => ({ type: CHANGE_CINEMA_LIST, data })

// 异步action，就是指action的值为函数,异步action中一般都会调用同步action，异步action不是必须要用的
export const incrementAsync = (data, time) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment(data))
    }, time)
  }
}

// 异步action redux-thunk中间件
export const cinemaListAsync = (data) => {
  return async (dispatch, getState) => {
    // 可以从 getState 获取到当前整个仓库数据状态state
    const state = getState()

    const { node, config } = data
    try {
      const param: Parameters<typeof getMaizuo>[0] = node
      const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)

      // 可以多次派发 action
      // 这里可以派发 loading 状态 为 true (表示正在加载中)
      // dispatch({ type: 'loading', data: true })

      const result = await res
      dispatch(cinemaList(result.data?.films || []))

      // 这里可以派发 loading 状态 为 false (表示加载完成)
      // dispatch({ type: 'loading', data: false })
    } catch (error: any) {
      console.error(error)
    }
  }
}

// 异步action redux-promise中间件 写法1
export const cinemaListAsyncPromise = async (data) => {
  const { node, config } = data
  try {
    const param: Parameters<typeof getMaizuo>[0] = node
    const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)
    const result = await res
    return cinemaListPromise(result.data?.films || [])
  } catch (error: any) {
    console.error(error)
  }
}

// 异步action redux-promise中间件 写法2
export const cinemaListAsyncPromise2 = (data) => {
  return new Promise(async (resolve, reject) => {
    const { node, config } = data
    const param: Parameters<typeof getMaizuo>[0] = node
    const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)
    const result = await res
    resolve(cinemaListPromise(result.data?.films || []))
  })
}

// 异步action redux-promise中间件 写法3
export const cinemaListAsyncPromise3 = (data) => {
  const { node, config } = data
  const param: Parameters<typeof getMaizuo>[0] = node
  return {
    type: CINEMALISTPROMISE,
    payload: getMaizuo(param, config).then((res) => res.data?.films || [])
  }
}
