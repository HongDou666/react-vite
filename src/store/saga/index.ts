import { all } from 'redux-saga/effects'

import cinemaTask from './cinemaTask.ts'

function* watchSaga() {
  yield all([
    // 电影模块
    cinemaTask()

    /* 其他模块
      studentTask()
      ...other Task
    */
  ])
  console.log('saga 完成')
}

export default watchSaga
