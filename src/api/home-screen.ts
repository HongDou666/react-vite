import { reqGet, reqPost } from '@/http/request'
import type { PromiseType } from '@/types/api'
import { ILineData, IPieData, IRadarData, IReportData } from '@/types/api/home-screen'

enum API {
  ORDER_REPORT_DATA = '/order/dashboard/getReportData',
  ORDER_LINE_DATA = '/order/dashboard/getLineData',
  ORDER_PIE_CITY_DATA = '/order/dashboard/getPieCityData',
  ORDER_PIE_AGE_DATA = '/order/dashboard/getPieAgeData',
  ORDER_RADAR_DATA = '/order/dashboard/getRadarData'
}

/*
  reqGet<类型参数1 类型参数2>
    参数1：接口数据返回的data的类型
    参数2：接口传参类型

  PromiseType<类型参数3>>
    参数3：接口数据返回的data的类型
*/

export const getReportData = (): PromiseType<IReportData> => {
  return reqGet<IReportData>(API.ORDER_REPORT_DATA)
}
export const getLineData = (): PromiseType<ILineData> => {
  return reqGet<ILineData>(API.ORDER_LINE_DATA)
}
export const getPieCityData = (): PromiseType<IPieData[]> => {
  return reqGet<IPieData[]>(API.ORDER_PIE_CITY_DATA)
}
export const getPieAgeData = (): PromiseType<IPieData[]> => {
  return reqGet<IPieData[]>(API.ORDER_PIE_AGE_DATA)
}
export const getRadarData = (): PromiseType<IRadarData> => {
  return reqGet<IRadarData>(API.ORDER_RADAR_DATA)
}
