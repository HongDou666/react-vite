import React, { ComponentType, ForwardedRef, forwardRef } from 'react'
import dayjs from 'dayjs'

/**
 * @param Comp 组件
 * ComponentType<any> = 可以接收任意 props 的任意 React 组件（函数组件 + 类组件）
 * @param args 参数列表
 * @returns 高阶组件
 */
export default function withClassLog(Comp: ComponentType<any>, ...args: any[]) {
  interface LogWrapperProps {
    refComp?: ForwardedRef<any>
    name?: string
    [key: string]: any
  }

  class LogWrapper extends React.Component<LogWrapperProps> {
    state = {
      title: args[0]
    }

    constructor(props: LogWrapperProps) {
      super(props)
    }

    componentDidMount() {
      console.log(`日志：组件${Comp.name}被创建了！${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
    }

    componentWillUnmount() {
      console.log(`日志：组件${Comp.name}被销毁了！${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
    }

    render() {
      const { refComp, ...rest } = this.props
      return <Comp forwardRefComp={refComp} {...rest} />
    }
  }

  return forwardRef<any, LogWrapperProps>((props, ref) => {
    // props 就是上一层传递进来的属性
    // ref 就是上一层传递进来的 ref
    return <LogWrapper {...props} refComp={ref} />
  }) as React.ForwardRefExoticComponent<LogWrapperProps>
}
