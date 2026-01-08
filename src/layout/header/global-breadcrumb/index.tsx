import { cloneElement } from 'react'
import type { BreadcrumbProps } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'

import { useMixMenuContext } from '@/hooks/common/menu'
import { useRouter } from '@/hooks/useRouter'

import { getBreadcrumbsByRoute } from './shared'

export interface MenuInfo {
  key: string
  keyPath: string[]
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
}

const GlobalBreadcrumb: React.FC = () => {
  const { router } = useRouter()
  const { routes: means, route } = useMixMenuContext()!

  const breadcrumb = getBreadcrumbsByRoute(route, means)

  function BreadcrumbContent({ icon, label }: { readonly icon: JSX.Element; readonly label: JSX.Element }) {
    return (
      <div className='i-flex-y-center align-middle'>
        {cloneElement(icon, { className: 'mr-4px text-icon', ...icon.props })}
        {label}
      </div>
    )
  }

  function handleClickMenu(menuInfo: MenuInfo) {
    router.navigate(menuInfo.key, { replace: false })
  }

  const items: BreadcrumbProps['items'] = breadcrumb.map((item, index) => {
    const commonTitle = item.icon ? (
      <BreadcrumbContent icon={item.icon as JSX.Element} key={item.key} label={item.label as JSX.Element} />
    ) : (
      item.label
    )

    const breadcrumbItem: any = { title: commonTitle }
    if ('children' in item && item.children) {
      breadcrumbItem.menu = {
        items: item.children.filter(Boolean).map((val: any) => ({
          key: val.path,
          label: val.label
        })) as MenuItemType[],
        selectable: true,
        selectedKeys: [(breadcrumb[index + 1] as any).path],
        onClick: handleClickMenu
      }
    }

    return breadcrumbItem
  })

  return (
    <>
      <Breadcrumb items={items} />
    </>
  )
}

export default GlobalBreadcrumb
