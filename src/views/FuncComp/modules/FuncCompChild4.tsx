import type { ComponentPropsWithoutRef } from 'react'

/**
 * ComponentPropsWithoutRef<'span'> 是 TypeScript 中用于 ​​获取 React 原生 <span> 元素的所有属性类型，并排除 ref 属性​​ 的工具类型。它的作用是为你的组件提供所有
 * <span> 元素支持的属性（如 className、style 等），同时禁止用户传递 ref 属性，这在封装组件时非常有用​​。
 */
interface FuncCompChild4Props extends ComponentPropsWithoutRef<'div'> {
  value: string
}

const FuncCompChild4 = ({ value, ...props }: FuncCompChild4Props) => {
  return <div {...props}>{value}</div>
}

export default FuncCompChild4
