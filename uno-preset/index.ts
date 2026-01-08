// @unocss-include

import type { Preset } from '@unocss/core'
import type { Theme } from '@unocss/preset-uno'

export function presetSoybeanAdmin(): Preset<Theme> {
  const preset: Preset<Theme> = {
    name: 'preset-soybean-admin',
    shortcuts: [
      {
        'flex-1-hidden': 'flex-1 overflow-hidden',
        'flex-center': 'flex justify-center items-center',
        'flex-col': 'flex flex-col',
        'flex-col-center': 'flex-center flex-col',
        'flex-col-stretch': 'flex-col items-stretch',
        'flex-x-center': 'flex justify-center',
        'flex-y-center': 'flex items-center',
        'i-flex-center': 'inline-flex justify-center items-center',
        'i-flex-col': 'flex-col inline-flex',
        'i-flex-col-center': 'flex-col i-flex-center',
        'i-flex-col-stretch': 'i-flex-col items-stretch',
        'i-flex-x-center': 'inline-flex justify-center',
        'i-flex-y-center': 'inline-flex items-center'
      },
      {
        'absolute-bl': 'absolute-lb',
        'absolute-br': 'absolute-rb',
        'absolute-center': 'absolute-lt flex-center size-full',
        'absolute-lb': 'absolute left-0 bottom-0',
        'absolute-lt': 'absolute left-0 top-0',
        'absolute-rb': 'absolute right-0 bottom-0',
        'absolute-rt': 'absolute right-0 top-0',
        'absolute-tl': 'absolute-lt',
        'absolute-tr': 'absolute-rt',
        'fixed-bl': 'fixed-lb',
        'fixed-br': 'fixed-rb',
        'fixed-center': 'fixed-lt flex-center size-full',
        'fixed-lb': 'fixed left-0 bottom-0',
        'fixed-lt': 'fixed left-0 top-0',
        'fixed-rb': 'fixed right-0 bottom-0',
        'fixed-rt': 'fixed right-0 top-0',
        'fixed-tl': 'fixed-lt',
        'fixed-tr': 'fixed-rt'
      },
      {
        'ellipsis-text': 'nowrap-hidden text-ellipsis',
        'nowrap-hidden': 'overflow-hidden whitespace-nowrap'
      }
    ]
  }

  return preset
}

/** Create color palette vars */
function createColorPaletteVars() {
  const colors = ['primary', 'info', 'success', 'warning', 'error']
  const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const colorPaletteVar = {}

  colors.forEach((color) => {
    colorPaletteVar[color] = `rgb(var(--${color}-color))`
    colorPaletteNumbers.forEach((number) => {
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`
    })
  })

  return colorPaletteVar
}

const colorPaletteVars = createColorPaletteVars()

/** Theme vars */
export const themeVars = {
  boxShadow: {
    header: 'var(--header-box-shadow)',
    sider: 'var(--sider-box-shadow)',
    tab: 'var(--tab-box-shadow)'
  },
  colors: {
    ...colorPaletteVars,
    'base-text': 'rgb(var(--base-text-color))',
    container: 'rgb(var(--container-bg-color))',
    inverted: 'rgb(var(--inverted-bg-color))',
    layout: 'rgb(var(--layout-bg-color))',
    nprogress: 'rgb(var(--nprogress-color))'
  }
}

export default presetSoybeanAdmin
