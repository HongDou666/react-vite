type UseAuthorizationType = [
  getToken: () => string | null,
  setToken: (token: any) => void,
  removeToken: () => void,
  clear: () => void
]

export const STORAGE_AUTHORIZE_KEY = 'Authorization'

export const useAuthorization = (key: string = STORAGE_AUTHORIZE_KEY): UseAuthorizationType => {
  /* 获取 token */
  const getToken = (): string | null => {
    return localStorage.getItem(key) && JSON.parse(localStorage.getItem(key)!)
  }

  /* 设置 token */
  const setToken = (value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /* 删除 token */
  const removeToken = () => {
    localStorage.removeItem(key)
  }

  /* 清除所有 localStorage */
  const clear = () => {
    localStorage.clear()
  }

  return [getToken, setToken, removeToken, clear]
}
