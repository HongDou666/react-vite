import { produce } from 'immer'

export const intialState = [
  {
    id: '001',
    title: 'html',
    isShow: true
  },
  {
    id: '002',
    title: 'css',
    isShow: true
  }
]

export type PrevStatetype = typeof intialState

export const reducer = produce((draft: PrevStatetype, action) => {
  switch (action.type) {
    case 'toggle':
      const todo = draft.find((todo) => todo.id === action.id)
      todo!.isShow = !todo?.isShow
      break

    case 'add':
      draft.push({
        id: action.id,
        title: `A new todo${draft.length - 1}`,
        isShow: true
      })
      break
    default:
      break
  }
})

export const intialState_1 = [
  {
    id: '001',
    title: 'prettierrc',
    isShow: true
  },
  {
    id: '002',
    title: 'eslint',
    isShow: true
  }
]

export const reducer_1 = (draft: PrevStatetype, action) => {
  switch (action.type) {
    case 'toggle':
      const todo = draft.find((todo) => todo.id === action.id)
      todo!.isShow = !todo?.isShow
      break

    case 'add':
      draft.push({
        id: action.id,
        title: `A new todo${draft.length - 1}`,
        isShow: true
      })
      break
    default:
      break
  }
}
