/**
	该文件专门用于暴露一个store对象，整个应用只有一个store对象
 * 目前createStore已经弃用，所以我们要引用legacy_createStore
 * compose：用来合成函数，在同时配置applyMiddleware、devtool时候需要引入
 * applyMiddleware：使用中间件来增强store
 * thunk：创建异步actions
 * devtool：判断浏览器是否有安装调试的插件，有则启用
 */

/* 引入createStore，专门用于创建redux中最为核心的store对象 */
import { applyMiddleware, legacy_createStore as createStore } from 'redux'
/* 引入redux-devtools-extension */
import { composeWithDevTools } from 'redux-devtools-extension'
/* 引入Redux持久化 */
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
/* 引入redux-promise 用于支持异步action */
import reduxPromise from 'redux-promise'
import createSagaMidller from 'redux-saga'
/* 引入redux-thunk，用于支持异步action */
import { thunk } from 'redux-thunk'

import { PERSIT_CONFIG_KEY } from './constant'
/* 引入汇总之后的reducer */
import reducer from './reducers'
/* 引入redux-saga，用于支持异步 action */
import watchSaga from './saga'

/* 创建 saga 中间件 */
const sagaMidlleware = createSagaMidller()

/* 持久化配置; redux-persist 的持久化选项 */
const persistConfig = {
  key: PERSIT_CONFIG_KEY, // // 存储在 localStorage 中的键名
  storage, // 使用 localStorage 作为存储介质
  whitelist: ['persons'], // 指定需要持久化的 reducer 键名
  blacklist: [] // 指定不需要持久化的 reducer 键名
}

/* 创建一个持久化的 reducer */
const persistedReducer = persistReducer(persistConfig, reducer)

const enhancer = composeWithDevTools(applyMiddleware(thunk, reduxPromise, sagaMidlleware))

/* 创建 Redux store */
const store = createStore(persistedReducer, enhancer)

/* 创建持久化存储 */
const persistor = persistStore(store)

/* 监听 saga 的变化 (启动一个生成器任务) */
sagaMidlleware.run(watchSaga)

/* 暴露 store persistor */
export { store, persistor }
