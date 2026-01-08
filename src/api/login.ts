import { reqGet, reqPost } from '@/http/request'
import type { PromiseType } from '@/types/api'
import type { LoginParamsType } from '@/types/api/login'

enum API {
  MOCK_INFO = '/users/login'
}

/*
  reqGet<类型参数1 类型参数2>
    参数1：接口数据返回的data的类型
    参数2：接口传参类型

  PromiseType<类型参数3>>
    参数3：接口数据返回的data的类型
*/

// 登录接口
export const postLogin = (param: LoginParamsType): PromiseType<string> => {
  return reqPost<string, LoginParamsType>(API.MOCK_INFO, param)
}
