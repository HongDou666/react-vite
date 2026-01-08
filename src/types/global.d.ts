/* declare global 扩展Ts全局变量类型 */
declare global {
  interface Window {
    toShow: (value: ToShowParamsType) => void
    hljs: any
  }

  interface ToShowParamsType {
    title: string
    type?: string
    duration?: number
  }

  interface Event {
    params: Record<string, any>
  }

  /* 配置ts环境变量 类型提示(import.meta.env.???) */
  interface ImportMetaEnv {
    /*
      我们每次添加完新的环境变量就在此添加一次ts类型
      这样我们就能在使用 import.meta.env 时获得ts语法提示
    */
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_BASE_API: string
    readonly VITE_SERVE: string
    readonly VITE_ICON_LOCAL_PREFIX: string
    readonly VITE_ICON_PREFIX: string
    readonly VITE_CUSTOM: string
    readonly VITE_FOTER: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
