import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'

/*
  ComponentPropsWithoutRef<'span'> 是 TypeScript 中用于 ​​获取 React 原生 <span> 元素的所有属性类型，并排除 ref 属性​​ 的工具类型。它的作用是为你的组件提供所有 <span> 元素支持的属性（如 className、style 等），同时禁止用户传递 ref 属性，这在封装组件时非常有用​
  如果组件需要暴露 ref（例如要操作底层 DOM），改用 ComponentPropsWithRef
​ */
interface ForwardRefChild2Props extends ComponentPropsWithRef<'video'> {
  src: string
  type: string
  width: string
}

function ForwardRefChild2({ src, type, width }, ref) {
  return (
    <video width={width} controls={true} ref={ref}>
      <source src={src} type={type} />
      Your browser does not support HTML5 video.
    </video>
  )
}

export default forwardRef<HTMLVideoElement, ForwardRefChild2Props>(ForwardRefChild2)
