import type React from 'react'

namespace SyncRoute {
  export type MetaProps = {
    title?: string
    auth?: boolean
    keepAlive?: boolean
    isValidateToken?: boolean
  }

  export type RoutersProps = {
    caseSensitive?: boolean
    children?: RoutersProps[]
    element?: React.ReactNode | React.LazyExoticComponent<React.FC>
    errorElement?: React.ReactNode
    index?: boolean
    path?: string
    id?: string
    auth?: boolean
    meta?: MetaProps
    isLink?: boolean
    unLazy?: boolean
    loader?: (param: any) => any
    action?: (param: any) => any
    HydrateFallback?: () => any
  }
}

/* 接口继承 */
interface RoutesPageType extends SyncRoute.RoutersProps {
  key?: string
  label?: string
  title?: string
  sort?: string
}

export type { SyncRoute, RoutesPageType }
