import { createContext, useContext } from 'react'

type RouterContextType = {
  router: Record<string, any>
}

export const RouterContext = createContext<RouterContextType | null>(null)

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) {
    throw new Error('useRouter must be used within a Provider')
  }

  return router
}
