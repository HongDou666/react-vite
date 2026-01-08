import IconMap from '../icon'

import type { MenuItemType, PagesType } from './type'

/* 编译时态读取目录结构（page.ts）*/
export const pages: Record<string, PagesType> = import.meta.glob('@/views/**/page.ts', {
  eager: true, // 默认以懒加载形式引入 取消为false
  import: 'default'
})

const sortKeys: Record<string, PagesType> = {}
const sortKeysArr: MenuItemType[] = []

for (const key in pages) {
  const sort = pages[key].sort
  if (!sortKeys[sort]) {
    sortKeys[sort] = { ...pages[key], number: 1 }
  } else {
    sortKeys[sort].number++
  }
}

for (const key in sortKeys) {
  const number = sortKeys[key]?.number
  const iconRender = IconMap[sortKeys[key].sort!]
  let sortKeysObj = {}
  if (number > 1) {
    const children: PagesType[] = []
    Object.keys(pages).forEach((item) => {
      if (key === pages[item].sort) {
        children.push({
          ...pages[item],
          key: pages[item].key,
          label: pages[item].label
        })
      }
    })
    sortKeysObj = {
      key,
      label: key,
      icon: (iconRender && iconRender.render()) || null,
      children
    }
  } else {
    sortKeysObj = {
      ...sortKeys[key],
      icon: (iconRender && iconRender.render()) || null
    }
  }
  sortKeysArr.push(sortKeysObj as MenuItemType)
}

export default sortKeysArr
