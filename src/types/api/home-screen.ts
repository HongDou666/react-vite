/* 首屏展示 */

export interface IReportData {
  codeLine: number
  salary: number
  icafeCount: number
  projectNum: number
}

export interface ILineData {
  label: string[]
  order: number[]
  money: number[]
}

export interface IPieData {
  value: number
  name: string
}

export interface IRadarData {
  indicator: Array<{ name: string; max: number }>
  data: {
    value: number[]
    name: string
  }[]
}
