import type { PluginOption } from 'vite'
export declare function createVitePlugins(
  viteEnv: Env.ImportMeta,
  pathSrc: string,
  isProduction: boolean,
  buildTime: string
): (PluginOption | PluginOption[])[]
