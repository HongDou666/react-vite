import { apply, call, cps, delay, put, select } from 'redux-saga/effects'

import { getMaizuo } from '@/api/mock/index'

import { cinemaListSaga } from '../actions/count'

/**
 * 回调模式的异步
 * @param {*} callback
 */
function mockCallback(params, callback) {
  if (params.status === 0) {
    // nodejs风格
    callback(null, { data: params.data?.films || [] })
  } else {
    callback(new Error('出错了'), { data: [] })
  }
}

/* 模拟请求 */
const getSetTimeoutAction = (value: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        node: {
          cityId: 440300,
          pageNum: 1,
          pageSize: 6,
          type: 1,
          k: 320674
        },
        config: {
          headers: {
            'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"173223556337542309134337","bc":"440300"}',
            'X-Host': 'mall.film-ticket.film.list'
          }
        }
      })
    }, value * 1000)
  })
}

/* 网络请求 */
const cinemaListAsyncSaga = async (data) => {
  const { node, config } = data
  try {
    const param: Parameters<typeof getMaizuo>[0] = node
    const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)
    const result = await res

    return result
    // return result.data?.films || []
  } catch (error: any) {
    console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
  }
}

// g2 是一个生成器函数
function* g2() {
  const result = yield '1'
  // saga 内部处理 会把 '1' 赋值给 result
  return result
}

function* getCinemaList(value) {
  /* delay指令：【阻塞】阻塞指定的毫秒数 */
  yield delay(1000)

  /* 
    这里可以在生成器内部调用其他生成器
    注意: 对于ES6生成器像这样写来说 代码逻辑是不会进入到g2生成器函数中的
    除非这样写 yield* g2() 才会进入到g2生成器函数中
    这样之所以会进入到g2生成器函数中 是因为 saga 内部会处理
    */
  const time = yield g2()
  /* (尽量统一使用call指令函数)
    当saga发现得到的结果是一个Promise对象，它会自动等待该Promise完成
    完成之后，会把完成的结果作为值传递到下一次next
    如果Promise对象被拒绝，saga会使用generator.throw抛出一个错误
  */
  // const payload1 = yield getSetTimeoutAction(1)

  /* call函数发异步请求 */
  const payload1 = yield call(getSetTimeoutAction, time)
  // 可以改变 getSetTimeoutAction 函数的this指向 为'zqc'
  /* 
    1. const payload1 = yield call({
        context: 'zqc',
        fn: getSetTimeoutAction,
      })
    2. const payload1 = yield call(['zqc', getSetTimeoutAction], 2000)
  */

  payload1.node.pageNum = value.current

  // const payload2 = yield call(cinemaListAsyncSaga, payload1)
  /* apply函数发异步请求 */
  const payload2 = yield apply(null, cinemaListAsyncSaga, [payload1])

  /* select指令：用于得到当前仓库中的数据 */
  const state = yield select()
  // const state = yield select((state) => state.persons)
  console.log('state', state)

  /* cps指令：【可能阻塞】用于调用那些传统的回调方式的异步函数 */
  const resp = yield cps(mockCallback, payload2)
  console.log('resp', resp) // { data: [xxx, xxx] }

  /* 
    put函数发出新的action,非阻塞式执行 
    put指令：用于重新触发action，相当于dispatch一个action 
  */
  yield put(cinemaListSaga(resp.data || []))
}

export { getCinemaList }
