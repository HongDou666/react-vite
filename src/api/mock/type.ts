export type MockInfoRequestType = {
  id: number
}
export type MockInfoResponseType = {
  name: string
  age: number
}
export type MockStatusRequestType = {
  name: string
}
export type MockListRequestType = {
  key: string
}
export type MockListResponseType = {
  list: {
    id: string
    name: string
    title: string
    address: string
    age: number
  }[]
}
export type StudentsRequestType = {
  time: number
  key?: string
  equipment?: number
}
export type StudentsResponseType = {
  id: string
  name: string
  agess: number
}
export type PostCacheDataResponseType = {
  id: string
  name: string
}
export type PostCacheDataRequestType = {
  parkId?: string
}
export type GetDownloadRequestType = {
  parkId: number
}
export type MaizuoRequestType = {
  cityId: number
  pageNum: number
  pageSize: number
  type: number
  k: number
}
export type MaizuoResponseType = {
  films: any[]
  total: number
}
