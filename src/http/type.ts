import { AxiosRequestConfig } from 'axios'
export type {
  AxiosRequestConfig,
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Canceler,
  CancelTokenSource
} from 'axios'

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  /* 
    json 格式:
    主要用于传输结构化的数据。JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于阅读和编写，并且机器也很容易解析和生成。当设置Content - Type为application/json;charset=UTF - 8时，表明请求或响应的主体内容是按照 JSON 格式来组织的
  */
  JSON = 'application/json;charset=UTF-8',
  /* 
    form-data qs 格式
    这是 HTML 表单默认的编码类型。当在 HTML 中提交一个表单（例如<form method="post">），如果没有指定enctype属性，表单数据就会以这种方式编码并发送; 数据会被编码为键值对的形式，类似于key1=value1&key2=value2。例如，一个包含用户名和密码字段的登录表单，当用户点击提交按钮后，表单数据会被编码成username=user123&password=pass123这样的格式发送给服务器
   */
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  /* 
    form-data upload 格式
    主要用于包含文件上传的表单。这种格式可以同时传输文本数据和文件数据。它将每个表单字段（包括文件）视为一个独立的部分，每个部分都有自己的头部信息，用于描述该部分的数据类型、名称等
  */
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  /* 
    binary 二进制格式上传
    抖音链接: https://www.douyin.com/user/self?from_tab_name=main&modal_id=7417821256508099867&showSubTab=video&showTab=record
    用于传输二进制数据。二进制数据可以是任何非文本的数据类型，如图片、音频、视频、可执行文件等
  */
  BINARY = 'application/octet-stream'
}

/* ts 定义接口返回数据格式的同一类型 */
export interface ResponseBody<T = any> {
  code: number
  data?: T
  msg: string
  status?: number // 状态码
}

/* ts 接口参数类型定义 */
export interface AxiosOptions<T = any> {
  url: string
  params?: T
  data?: T
}

/* ts 拦截器函数中参数类型定义 */
export interface RequestConfigExtra {
  token?: boolean
  customDev?: boolean
  loading?: boolean
  retries?: number
}

/* ts BaseURL 类型定义 */
export interface BaseURLType {
  [key: string]: string
}

/* 网络请求等待队列 */
export type RequestItem<T = any> = {
  resolve: (res: any) => void
  opt: AxiosOptions<T> & AxiosRequestConfig & RequestConfigExtra
}

/* 网络请求并发配置 */
export interface ConcurrentRequestType {
  activeRequests: number
  maxConcurrent: number
  requestQueue: RequestItem[]
}
