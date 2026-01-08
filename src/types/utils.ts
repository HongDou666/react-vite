/*
  封装一个接口类型,把接口里面的一些字段变为选填,其余的不变 (部分字段可选)
  抖音链接: https://www.douyin.com/user/self?from_tab_name=main&modal_id=7408805676782243082&showTab=record
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
