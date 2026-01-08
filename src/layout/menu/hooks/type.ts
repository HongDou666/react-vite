import type { Optional } from '@/types/utils'

export type PagesType = {
  key: string
  path: string
  label: string
  title?: string
  sort: string
  number: number
  icon?: string
}

export type MenuItemType = Optional<PagesType, 'path' | 'sort' | 'number'> & {
  children?: PagesType[]
}
