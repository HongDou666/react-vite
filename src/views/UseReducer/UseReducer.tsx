/*
  useReducer是 React Hooks 中的一个，用于在函数式组件中处理复杂的状态逻辑，它是Redux中reducer概念在 React 组件中的一个轻量级实现。其作用类似于setState，但更适合处理包含多个子值或者下一个状态依赖于前一个状态的复杂状态更新
*/
import UseReducerChild1 from './modules/UseReducerChild1'
import UseReducerChild2 from './modules/UseReducerChild2'
import { initFn, intialState, reducer } from './hooks'

import moduleScss from './index.module.scss'

const UseReducer: React.FC = () => {
  /* hooks 最好在组件最顶层调用 */
  const [state, dispatch] = useReducer(reducer, intialState, initFn)

  const handleAdd = () => {
    const value = state.count + 1
    dispatch({
      type: 'zqc-add',
      value
    })
  }

  return (
    <div className={moduleScss.useReducer}>
      <h1>UseReducer</h1>
      <Button type='primary' onClick={handleAdd}>
        count 数值 +1
      </Button>
      <Tag color='#2db7f5'>count: {state.count}</Tag>

      <UseReducerChild1 state={state} dispatch={dispatch}></UseReducerChild1>
      <UseReducerChild2 state={state} dispatch={dispatch}></UseReducerChild2>
    </div>
  )
}

export default UseReducer
