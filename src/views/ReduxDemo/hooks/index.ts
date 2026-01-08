import { useAppSelector } from '@/hooks/business/useStore'
import store from '@/store-rtk/index'
import { getOfficialPos, regionListInfo } from '@/store-rtk/modules/widgetStore'

export function useOfficialPos() {
  const officialPos = useAppSelector(getOfficialPos)

  return officialPos
}

export function useAllState() {
  return regionListInfo(store.getState())
}
