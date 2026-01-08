import React, { ComponentType, ForwardedRef, forwardRef, useEffect } from 'react'
import dayjs from 'dayjs'

/**
 * @param Comp 组件
 * @param args 参数列表
 * @returns 高阶组件
 */
export default function withFuncLog(Comp: ComponentType<any>, ...args: any[]) {
  interface LogWrapperProps {
    refComp?: ForwardedRef<any>
    name?: string
    [key: string]: any
  }

  /** 用函数组件替换 class LogWrapper */
  const LogWrapper: React.FC<LogWrapperProps> = (props) => {
    const { refComp, ...rest } = props

    // 模拟 componentDidMount + componentWillUnmount
    useEffect(() => {
      console.log(`日志：组件 ${Comp.name} 被创建！${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)

      return () => {
        console.log(`日志：组件 ${Comp.name} 被销毁！${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
      }
    }, [])

    return <Comp forwardRefComp={refComp} {...rest} />
  }

  /** 对外继续支持 forwardRef */
  return forwardRef<any, LogWrapperProps>((props, ref) => {
    return <LogWrapper {...props} refComp={ref} />
  }) as React.ForwardRefExoticComponent<LogWrapperProps>
}
