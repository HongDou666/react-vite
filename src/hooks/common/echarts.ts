import { RefObject } from 'react'
import { useSize, useUnmount, useUpdateEffect } from 'ahooks'
/* 普通导入（不带 type）用于导入实际的图表类，这些类可以用于创建图表实例或配置图表行为。例如，BarChart 类用于创建柱状图实例 */
import { BarChart, GaugeChart, LineChart, PictorialBarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
/* 普通导入用于获取组件类，这些组件可以添加到图表中以增强其功能，例如网格（GridComponent）、图例（LegendComponent）和工具提示（TooltipComponent） */
import {
  DatasetComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components'
/* 导入ECharts的核心库，允许你访问ECharts的基本功能，如初始化图表实例 */
import * as echarts from 'echarts/core'
/* 导入ECharts的一些高级特性，如标签布局（LabelLayout）和通用过渡动画（UniversalTransition），这些特性可以用来增强图表的视觉效果和交互性 */
import { LabelLayout, UniversalTransition } from 'echarts/features'
/* 导入Canvas渲染器，ECharts使用渲染器来在网页上绘制图表。Canvas渲染器是基于HTML5 Canvas元素的，适用于大多数场景 */
import { CanvasRenderer } from 'echarts/renderers'
import { debounce } from 'lodash-es'

import { getDarkMode, getThemeSettings } from '@/store-rtk/modules/theme/index'

import { useAppSelector } from '../business/useStore'

/* 导入不同类型的图表选项类型（如 BarSeriesOption 表示柱状图的选项类型）
   导入组件的选项类型，用于类型检查 */
import type { ECOption } from './type'

/* 注册必须的组件 */
echarts.use([
  TitleComponent, // 标题组件
  LegendComponent, // 图例组件
  TooltipComponent, // 提示框组件
  GridComponent, // 网格组件
  DatasetComponent, // 数据集组件
  TransformComponent, // 数据转换组件
  ToolboxComponent, // 工具箱组件
  GraphicComponent, // 图形组件
  DataZoomComponent, // 数据区域缩放组件
  BarChart, // 柱状图
  LineChart, // 折线图
  PieChart, // 饼图
  ScatterChart, // 散点图
  PictorialBarChart, // 象形柱图
  RadarChart, // 雷达图
  GaugeChart, // 仪表盘
  LabelLayout, // 标签布局
  UniversalTransition, // 通用过渡动画
  CanvasRenderer // Canvas渲染器
])

interface ChartHooks {
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>
  onRender?: (chart: echarts.ECharts) => void | Promise<void>
  onUpdated?: (chart: echarts.ECharts) => void | Promise<void>
  onEvents?: { [event: string]: () => void | Promise<void> }
}

/**
 * use echarts
 *
 * @param optionsFactory echarts options factory function
 * @param darkMode dark mode
 */
export function useEcharts<T extends ECOption>(
  optionsFactory: () => T,
  hooks: ChartHooks = {}
): {
  domRef: React.RefObject<HTMLDivElement>
  chart: RefObject<echarts.ECharts | null>
  setOptions: (options: T) => void
  updateOptions: (callback: (opts: T, optsFactory: () => T) => ECOption) => void
  destroy: () => void
} {
  const darkMode = useAppSelector(getDarkMode)
  const themeSettings = useAppSelector(getThemeSettings)

  const domRef = useRef<HTMLDivElement | null>(null)
  const initialSize = { height: 0, width: 0 }
  const size = useSize(domRef)

  const chart = useRef<echarts.ECharts | null>(null)
  const chartOptions = useRef<T>(optionsFactory())

  const onDebounce = useRef(
    debounce((callBack) => {
      callBack()
    }, 300)
  ).current

  const {
    onDestroy,
    onRender = (instance) => {
      const textColor = darkMode ? 'rgb(224, 224, 224)' : 'rgb(31, 31, 31)'
      const maskColor = darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'

      /* loading功能可以放到组件中使用 */
      /*
        instance.showLoading({
          color: themeSettings.themeColor,
          fontSize: 14,
          maskColor,
          textColor
        })
      */
    },
    onUpdated = (instance) => {
      instance.hideLoading()
    },
    onEvents = {}
  } = hooks

  /**
   * @description 是否可以渲染图表 当domRef准备好时 initialSize是有效的
   */
  function canRender() {
    return domRef.current && initialSize.width > 0 && initialSize.height > 0
  }

  /** 图表是否渲染呈现 */
  function isRendered() {
    return Boolean(domRef.current && chart.current)
  }

  /**
   * update chart options
   *
   * @param callback callback function
   */
  async function updateOptions(callback: (opts: T, optsFactory: () => T) => ECOption = () => chartOptions.current) {
    const updatedOpts = callback(chartOptions.current, optionsFactory)
    Object.assign(chartOptions.current, updatedOpts)

    if (!isRendered()) {
      await render()
      return
    }

    /* 清除之前的图表数据 */
    if (isRendered()) {
      chart.current?.clear()
    }

    chart.current?.setOption({ ...chartOptions.current, backgroundColor: 'transparent' })

    await onUpdated?.(chart.current!)
  }

  function setOptions(options: T) {
    chart.current?.setOption(options)
  }

  /** render chart */
  async function render() {
    if (!isRendered()) {
      const chartTheme = darkMode ? 'dark' : 'light'

      chart.current = echarts.init(domRef.current, chartTheme)

      chart.current.setOption({ ...chartOptions.current, backgroundColor: 'transparent' })

      initEvent(chart.current)

      await onRender?.(chart.current)
    }
  }

  /* 添加事件支持 */
  function initEvent(instance: echarts.ECharts) {
    Object.keys(onEvents || {}).forEach((attrKey) => {
      const cb = onEvents![attrKey]
      /* 如果cb为函数的话，则绑定事件 */
      typeof cb === 'function' && instance?.on(attrKey.toLowerCase(), cb as () => void)
    })
  }

  /** resize chart */
  function resize() {
    chart.current?.resize()
  }

  /* 销毁图表 */
  async function destroy() {
    if (!chart.current) return

    await onDestroy?.(chart.current)
    chart.current?.dispose()
    chart.current = null
  }

  /** change chart theme */
  async function changeTheme() {
    await destroy()
    await render()
    await onUpdated?.(chart.current!)
  }

  /**
   * render chart by size
   *
   * @param w width
   * @param h height
   */
  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w
    initialSize.height = h

    /* 尺寸不正常，销毁图表 */
    if (!canRender()) {
      await destroy()
      return
    }

    /* 图表自适应 */
    if (isRendered()) {
      resize()
    }

    /* render chart */
    await render()
  }

  /* 在组件卸载时执行 */
  useUnmount(() => {
    destroy()
  })

  /* useUpdateEffect 用法等同于 useEffect 但是会忽略首次执行 只在依赖更新时执行 */
  useUpdateEffect(() => {
    onDebounce(() => renderChartBySize(size?.width as number, size?.height as number))
  }, [size])

  useUpdateEffect(() => {
    changeTheme()
  }, [darkMode])

  return {
    domRef,
    chart,
    setOptions,
    updateOptions,
    destroy
  }
}
