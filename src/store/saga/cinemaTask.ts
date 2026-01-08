import { takeEvery } from 'redux-saga/effects'

import { GETCINEMALIST } from '../constant'

import { getCinemaList } from './cinema'

export default function* () {
  yield takeEvery(GETCINEMALIST, getCinemaList) // 不断的监听某个action 这里监听电影列表刷新action
  // yield takeEvery(xxxx, xxxxx)
  // yield takeEvery(xxxx, xxxxx)
  // yield takeEvery(xxxx, xxxxx)
  console.log('正在监听 GETCINEMALIST、xxxx、xxxx')
}
