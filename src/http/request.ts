import { message } from 'antd'
import axios from 'axios'

import { router } from '@/routes'
import { encryptionData, useAuthorization } from '@/utils'

import type {
  AxiosError,
  AxiosInstance,
  AxiosOptions,
  AxiosRequestConfig,
  AxiosResponse,
  BaseURLType,
  Canceler,
  CancelTokenSource,
  ConcurrentRequestType,
  InternalAxiosRequestConfig,
  RequestConfigExtra,
  RequestItem,
  ResponseBody
} from './type' /* 导入 axios ts 类型 */
import { ContentTypeEnum, RequestEnum } from './type' /* 导入 ts 枚举类型 */

/* 获取 存储 删除 token */
const [getToken, setToken, removeToken] = (() => useAuthorization())()

/* 网络请求并发配置 */
const concurrentRequest: ConcurrentRequestType = {
  /* 当前网络请求-活跃数量 */
  activeRequests: 0,
  /* 最大请求并发数量 */
  maxConcurrent: 8,
  /* 进入等待队列的网络请求参数配置 config */
  requestQueue: []
}

/* 设置代理监听 concurrentRequest */
function createObservable<T extends { [key: string]: any; activeRequests: number }>(target: T): T {
  return new Proxy(target, {
    set(target: T, propertyKey: string | symbol, value: any, receiver: any): boolean {
      /* 将 propertyKey 转换为 string，以便与 'activeRequests' 字符串比较 */
      const key = typeof propertyKey === 'symbol' ? propertyKey.toString() : propertyKey

      /* 只在属性为 'activeRequests' 且值发生变化时执行 */
      if (key === 'activeRequests' && target[key as keyof T] !== value) {
        /*
          这里可以添加额外的逻辑，如通知监听器等
          如果请求队列的数量少于最大并发数量，则从等待队列中取出一个请求进而执行发送
         */
        if (value && target['requestQueue'].length && value - target['requestQueue'].length < target['maxConcurrent']) {
          dequeueRequest()
        }

        /* 执行实际的赋值操作 */
        Reflect.set(target, propertyKey, value, receiver)

        /* 指示设置成功 */
        return true
      }
      /* 如果不是 'activeRequests' 或者值没有变化，则直接调用原始设置操作 */
      return Reflect.set(target, propertyKey, value, receiver)
    }
  }) as T
}

/* 代理监听 concurrentRequest */
const obConcurrentRequest = createObservable(concurrentRequest)

/* 网络初次请求失败, 设置请求重试的间隔次数 */
const retries = 3

/* 设置网络请求重试的间隔时间 */
const retryDelay = 2000

/* axios 网络取消请求生成器 */
export const cancelToken = axios.CancelToken

/* 存放每次 new CancelToken 生成的取消 axios 网络请求方法 */
const axiosSource: Map<string, Canceler> = new Map()

/* 第一种方式: 3. 取消未完成的所有网络请求 */
export function cancelAllAxios() {
  for (const [key, value] of axiosSource) {
    key && value('取消网络请求') // message 参数是可选的
  }
  axiosSource.clear()
  Object.assign(concurrentRequest, {
    activeRequests: 0,
    requestQueue: []
  })
}

/* 使用 CancelToken.source 工厂方法创建一个 cancel token */
let cancelRequestSource: CancelTokenSource[] = []

/* 第二种方式: 2. 取消未完成的所有网络请求 */
export function cancelAllRequest(): void {
  cancelRequestSource.forEach((source: CancelTokenSource) => {
    source.cancel('取消网络请求')
  })
  cancelRequestSource = []
  Object.assign(concurrentRequest, {
    activeRequests: 0,
    requestQueue: []
  })
}

/* 网络请求失败尝试重新发起请求 */
const repeatRequest = <T extends AxiosRequestConfig & RequestConfigExtra>(config: T) => {
  if (!config.retries) {
    config.retries = 0
  }
  if (config.retries < retries) {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (config.retries || config.retries === 0) {
        config.retries++
      }
      instancePromise(config as AxiosOptions<any> & RequestConfigExtra)
      clearTimeout(timer)
    }, retryDelay)
  }
}

/* 生成source中 网络取消请求中 的唯一key值 */
const getSourceKey = <T extends AxiosRequestConfig & RequestConfigExtra>(config: T): string => {
  const { url, method, params, data } = config
  return encryptionData(`${url}${method}${JSON.stringify(params)}${JSON.stringify(data)}` || '')
}

/* 初始的baseURL映射 */
const baseURLs: BaseURLType = {
  default: import.meta.env.VITE_APP_BASE_API ?? '/' // 配置baseURL
}

/* 创建一个axios实例映射，根据key来获取不同的实例 */
const axiosInstances: { [key: string]: AxiosInstance } = {}

/* 创建一个axios实例的工厂函数 */
function createAxiosInstance(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 1000 * 60 * 2, // 两分钟超时
    timeoutErrorMessage: '网络请求超时, 请刷新页面重试', // 超时提示信息
    withCredentials: true, // 允许跨域携带cookie
    /* 请求头设置 'application/json;charset=UTF-8' 告诉服务器发送的数据是以 JSON 格式编码的，并且使用 UTF-8 字符编码进行传输 */
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
      'X-Requested-With': 'XMLHttpRequest' // 兼容性处理，防止某些浏览器不支持 fetch 请求
    }
  } as any)
}

function getAxiosInstance(key: string): AxiosInstance {
  if (!axiosInstances[key]) {
    const baseURL = baseURLs[key] || baseURLs.default
    axiosInstances[key] = createAxiosInstance(baseURL)
  }
  return axiosInstances[key]
}

/* 暴露一个方法来获取axios实例 */
function getAxios() {
  return getAxiosInstance('default')
}

/* 创建axios实例 */
const instance: AxiosInstance = getAxios()

/* 请求拦截器成功处理 */
async function requestHandler(
  config: InternalAxiosRequestConfig & RequestConfigExtra
): Promise<InternalAxiosRequestConfig> {
  /*
    import.meta.env.DEV 的值为 true 表示当前处于开发环境
    可处理请求前的url, 可以替换url的请求前缀 baseUrl
    config.baseURL = import.meta.env.VITE_APP_BASE_API_DEV
  */

  /* 从 localStorage 获取 token ，并添加到请求头中 */
  const token = getToken()

  /* 设置token */
  if (token) {
    // config.headers.set('Authorization-Token', `Bearer ${token}`) // 方式一
    config.headers['Authorization-Token'] = `Bearer ${token}` // 方式二
  }

  /* 第一种方式: 1. 通过传递一个 executor 函数到 CancelToken 的构造函数来创建一个 cancel token */
  const key = getSourceKey(config)
  if (key && !(config.data instanceof FormData)) {
    /*
      判断此次请求是否存在和之前一样的请求(请求路径 请求方式 请求参数)，如果存在就把之前一样的请求取消掉
      参数为 FormData 时忽略（大文件分片连续多次上传）
    */
    if (axiosSource.has(key)) {
      axiosSource.get(key)?.()
      axiosSource.delete(key)
    }
    config.cancelToken = new cancelToken(function executor(cancel) {
      /* 把新的取消请求方法保存到 axiosSource */
      axiosSource.set(key, cancel)
    })
  }

  /* 第二种方式: 1. cancel token */
  // if (cancelToken) {
  //   const source: CancelTokenSource = cancelToken.source()
  //   config.cancelToken = source.token
  //   cancelRequestSource.push(source)
  // }

  /* headers其他配置; value 不能是中文 */
  config.headers['Accept-Language'] = 'zh-CN'
  config.headers['Request-Id'] = new Date().getTime() + Math.floor(Math.random() * 999999)

  return config
}

/* 请求拦截器错误处理 */
function requestErrorHandler(error: AxiosError): Promise<any> {
  return Promise.reject(error)
}

/* request实例添加请求拦截器 */
instance.interceptors.request.use(requestHandler, requestErrorHandler)

/* 响应拦截器成功处理 */
function responseHandler(response: AxiosResponse): ResponseBody<any> | AxiosResponse<any> | Promise<any> | any {
  /* 第一种方式: 2. 请求完成后，清除此次请求的取消方法 */
  const { config } = response
  const key = getSourceKey(config)
  if (key && axiosSource.get(key)) {
    axiosSource.delete(key)
  }

  /* 这里可以获取到 响应头内容 response */

  const res = response.data
  if ((res.code && res.code !== 200) || (res.status && res.status !== 200)) {
    /* 处理接口返回的错误情况 可以弹出消息提示框等 */
    message.error(res.msg || '数据错误')
    return Promise.reject(new Error(res.msg || 'Error'))
  }
  /* 正常返回数据 */
  return res
}

/* 响应拦截器错误处理 */
function errorHandler(error: AxiosError): Promise<any> {
  const { response, config } = error
  if (response && response.status) {
    const { status } = response as AxiosResponse<ResponseBody>
    switch (status) {
      /* 自定义的错误状态码处理 */
      case 400:
        message.error('请求错误')
        break
      case 401:
        /* 未授权，跳转到登录页或执行其他逻辑 */
        message.error('未授权，请登录')
        setTimeout(() => {
          router.navigate('/login') // 路由跳转到登录页
          window.location.reload() // 强制页面刷新

          // window.location.href = '/login' 浏览器跳转到登录页
        }, 50)
        break
      case 403:
        /* 禁止访问，跳转到错误页或执行其他逻辑 */
        message.error('拒绝访问')
        /* 尝试再次请求 */
        repeatRequest(config as InternalAxiosRequestConfig & RequestConfigExtra)
        break
      case 404:
        message.error('请求地址出错')
        break
      case 500:
        message.error('服务器错误')
        break
      case 503:
        message.error('服务不可用')
        break
      // ...其他状态码处理
      default:
        message.error(`网络连接出错(${status}),请稍后再试!`)
        break
    }

    /* 返回封装后的错误信息 */
    return Promise.reject({
      message: response.data || 'Error',
      code: response.status
    })
  }

  /* 取消请求的错误处理（当有请求被取消时触发条件判断） */
  if (axios.isCancel(error)) {
    return Promise.reject(error)
  }

  /* 其他错误处理 */
  return Promise.reject(error)
}

/* request实例添加响应拦截器 */
instance.interceptors.response.use(responseHandler, errorHandler)

/* 请求入队等待执行 */
const enqueueRequest = <T = any>(
  options: AxiosOptions<T> & AxiosRequestConfig & RequestConfigExtra,
  resolve: (res: any) => void
) => {
  concurrentRequest.requestQueue.push({
    resolve,
    opt: options
  })
}

/* 请求出队执行网络请求 */
const dequeueRequest = () => {
  const requestItem = concurrentRequest.requestQueue.shift() as RequestItem
  instancePromise(requestItem, true)
}

/* 此处相当于二次响应拦截, 为响应数据进行定制化处理 */
function instancePromise<R = any, T = any>(
  options: (AxiosOptions<T> & AxiosRequestConfig & RequestConfigExtra) | RequestItem<T>,
  dequeueRequestSend: boolean = false
): Promise<ResponseBody<R>> {
  obConcurrentRequest.activeRequests++
  /* 少于并发数量直接执行网络请求 || 从等待队列拿出执行网络请求 */
  if (obConcurrentRequest.activeRequests <= concurrentRequest.maxConcurrent || dequeueRequestSend) {
    let requestOptions
    if (dequeueRequestSend && Object.prototype.hasOwnProperty.call(options, 'opt')) {
      requestOptions = (options as RequestItem<T>).opt
    } else {
      requestOptions = options
    }
    return new Promise((resolve, reject) => {
      instance
        .request<any, AxiosResponse<ResponseBody>>(requestOptions)
        .then((res) => {
          /*
            res 就是和后端共同决定好的最外层结构
              code: number
              data?: T
              msg: string
            */
          /* 此处返回data信息 也就是 type 中配置好的 ResponseBody类型 */
          if (dequeueRequestSend) {
            ;(options as RequestItem<T>).resolve(res as unknown as ResponseBody<R>)
          } else {
            resolve(res as unknown as ResponseBody<R>)
          }
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
        .finally(() => {
          obConcurrentRequest.activeRequests--
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      enqueueRequest<T>(options as any, resolve as (res: any) => void)
    })
  }
}

/* get请求 */
export function reqGet<R = any, T = any>(
  url: string,
  params?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R>> {
  const options = {
    url,
    params,
    method: RequestEnum.GET,
    ...config
  }
  return instancePromise<R, T>(options)
}

/* post请求 */
export function reqPost<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R>> {
  const options = {
    url,
    data,
    method: RequestEnum.POST,
    ...config
  }
  return instancePromise<R, T>(options)
}

/* put请求 */
export function reqPut<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R>> {
  const options = {
    url,
    data,
    method: RequestEnum.PUT,
    ...config
  }
  return instancePromise<R, T>(options)
}

/* delete请求 */
export function reqDelete<R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R>> {
  const options = {
    url,
    data,
    method: RequestEnum.DELETE,
    ...config
  }
  return instancePromise<R, T>(options)
}

/* 对外暴露-instance */
export default instance
