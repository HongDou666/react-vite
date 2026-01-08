// @unocss-include
import systemLogo from '@/assets/svg/loading.svg?raw'
import { getRgb } from '@/utils'

export function setupLoading() {
  const themeColor = '#646cff'
  const { b, g, r } = getRgb(themeColor)
  const primaryColor = `--primary-color: ${r} ${g} ${b}`

  const logoWithClass = systemLogo.replace('<svg', `<svg class="size-90px fill-primary"`)

  const loadingClasses = [
    'left-0 top-0',
    'left-0 bottom-0 animate-delay-500',
    'right-0 top-0 animate-delay-1000',
    'right-0 bottom-0 animate-delay-1500'
  ]
  const dot = loadingClasses
    .map((item) => {
      return `<div class="absolute w-12px h-12px bg-primary rounded-6px animate-pulse ${item}"></div>`
    })
    .join('\n')

  const loading = `
    <div class="fixed-center flex-col" style="${primaryColor}">
      ${logoWithClass}
      <div class="w-40px h-40px my-30px">
        <div class="relative h-full animate-spin">
          ${dot}
        </div>
      </div>
      <h2 class="font-900 text-26px color-#646464" style="font-family: cursive;">正在加载中...</h2>
    </div>`

  const app = document.getElementById('root')

  if (app) {
    app.innerHTML = loading
  }
}
