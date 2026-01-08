import type { AnyColor, HslColor, RgbColor } from 'colord'
import { colord, extend } from 'colord'
/* labPlugin为colord添加了LAB颜色模型的支持。LAB颜色模型是一种基于人眼感知的颜色空间，广泛用于颜色科学中 */
import labPlugin from 'colord/plugins/lab'
/* mixPlugin允许你混合两种颜色，生成一个新的颜色。这对于创建渐变色或模拟颜色混合效果非常有用 */
import mixPlugin from 'colord/plugins/mix'
/* namesPlugin为colord添加了颜色名称的支持，使得你可以通过颜色名称（如"red"、"blue"等）来创建颜色实例 */
import namesPlugin from 'colord/plugins/names'

// 扩展colord的功能，添加LAB颜色模型、颜色混合和颜色名称支持
extend([namesPlugin, mixPlugin, labPlugin])

// 判断颜色是否有效
export function isValidColor(color: AnyColor) {
  return colord(color).isValid()
}

// 获取颜色的HEX值
export function getHex(color: AnyColor) {
  return colord(color).toHex()
}

// 获取颜色的RGB值
export function getRgb(color: AnyColor) {
  return colord(color).toRgb()
}

// 获取颜色的HSL值
export function getHsl(color: AnyColor) {
  return colord(color).toHsl()
}

// 获取颜色的HSV值
export function getHsv(color: AnyColor) {
  return colord(color).toHsv()
}

// 获取颜色的LAB值
export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2)
}

// 将HSL颜色转换为HEX值
export function transformHslToHex(color: HslColor) {
  return colord(color).toHex()
}

/**
 * Add color alpha
 * @description: 添加颜色的透明度
 * @param color - Color
 * @param alpha - Alpha (0 - 1)
 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex()
}

/**
 * Mix color
 * @description: 混合两种颜色，生成一个新的颜色
 * @param firstColor - First color
 * @param secondColor - Second color
 * @param ratio - The ratio of the second color (0 - 1)
 */
export function mixColor(firstColor: AnyColor, secondColor: AnyColor, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex()
}

/**
 * Transform color with opacity to similar color without opacity
 * @description: 将带有透明度的颜色转换为不透明的相似颜色
 * @param color - Color
 * @param alpha - Alpha (0 - 1)
 * @param bgColor Background color (usually white or black)
 */
export function transformColorWithOpacity(color: string, alpha: number, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha)
  const { b: oB, g: oG, r: oR } = colord(originColor).toRgb()

  const { b: bgB, g: bgG, r: bgR } = colord(bgColor).toRgb()

  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al
  }

  const resultRgb: RgbColor = {
    b: calRgb(oB, bgB, alpha),
    g: calRgb(oG, bgG, alpha),
    r: calRgb(oR, bgR, alpha)
  }

  return colord(resultRgb).toHex()
}

/**
 * Is white color
 * @description: 判断颜色是否为白色
 * @param color - Color
 */
export function isWhiteColor(color: AnyColor) {
  return colord(color).isEqual('#ffffff')
}

export { colord }
