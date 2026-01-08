import { getPermissionList } from '@/api/user'
import { pages } from '@/layout/menu/hooks'
import { IMenu } from '@/types/api/menu'

function getMenuPath(list: IMenu[]): string[] {
  return list.reduce((res: string[], item: IMenu) => {
    return res.concat(Array.isArray(item.children) && !item.buttons ? getMenuPath(item.children) : item.path + '')
  }, [])
}

export default async function powerLoader() {
  try {
    const result = await (getPermissionList() as ReturnType<typeof getPermissionList>)
    const { buttonList, menuList } = result.data!
    const menuPathList = getMenuPath(menuList)
    const menuPathList_: string[] = []

    /* 这里我们直接模拟可以访问的路由 就不再使用从后台获取的可访问路由数据了 */
    for (const key in pages) {
      menuPathList_.push(pages[key].path)
    }

    return {
      menuList,
      menuPathList: menuPathList_,
      buttonList
    }
  } catch (error: any) {
    console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    return {
      menuList: [],
      menuPathList: [],
      buttonList: []
    }
  }
}
