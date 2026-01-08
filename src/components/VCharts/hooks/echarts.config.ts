import { RefObject, useRef } from 'react'
/* 引入用到的 echarts图表组件 */
import { BarChart, GaugeChart, LineChart, PieChart } from 'echarts/charts'
/* 引入提示框、数据集等组件 */
import {
  DatasetComponent, // 数据集组件
  DataZoomComponent, // 数据区域缩放组件
  GraphicComponent, // 图形组件
  GridComponent, // 直角坐标系组件
  LegendComponent, // 图例组件
  TitleComponent, // 标题组件
  ToolboxComponent, // 工具箱组件
  TooltipComponent, // 提示框组件
  TransformComponent // 转换组件
} from 'echarts/components'
/* 引入 echarts 主模块 */
import * as echarts from 'echarts/core'
/* 引入标签自动布局、全局过渡动画等特性 */
import { LabelLayout, UniversalTransition } from 'echarts/features'
/* 引入 Canvas 渲染器 是必需的 */
import { CanvasRenderer } from 'echarts/renderers'
/* lodash 深拷贝 | 防抖 | 递归合并 | 执行深比较来确定两者的值是否相等 */
import { cloneDeep, debounce, isEqual, merge } from 'lodash-es'

/* 引入图表类型 */
import { ChartType } from '../types'

/* 定义图表钩子参数的类型 */
interface ChartHookOption {
  type: ChartType
  el: RefObject<HTMLDivElement>
  args?: { [event: string]: any }
}

const optionsModules = import.meta.glob<{ default: echarts.EChartsCoreOption }>('../options/**.ts')

/**
 *  视口变化时echart图表自适应调整
 *  存放各类图表的基本信息
 */
class ChartsResize {
  /* 缓存已经创建的图表实例 */
  #charts = new Set<echarts.ECharts>()
  /* 缓存已经从本地资源获取的图表配置基本信息 */
  #options = new Map<ChartType, echarts.EChartsCoreOption>()
  /* 时间戳 (用于监听图表自适应缩放) */
  #timeId: ReturnType<typeof setTimeout> | null = null

  constructor() {
    /*
      视口变化时调整图表 && 加上防抖
      问题方案: 这里不在采用 window.addEventListener('resize'）的方式监听视口变化
      原因分析: 因为有时并非浏览器窗口变化需要图表缩放 而是其他元素的隐藏或显示进而影响到了图表元素本身的大小
    */
    // window.addEventListener('resize', debounce(this.handleResize.bind(this)))
  }
  /* 获取图表实例 */
  getCharts() {
    return [...this.#charts]
  }
  /* 调整图表视口缩放 */
  handleResize() {
    clearTimeout(this.#timeId!)
    if (this.#charts.size) {
      this.#timeId = setTimeout(() => {
        this.#charts.forEach((chart) => {
          chart?.resize()
        })
      }, 500)
    }
  }
  /* 添加图表实例到缓存 */
  addChart(chart: echarts.ECharts) {
    this.#charts.add(chart)
  }
  /* 从缓存中移除图表实例 */
  removeChart(chart: echarts.ECharts) {
    this.#charts.delete(chart)
  }
  /* 销毁监听视口缩放事件 */
  removeListener() {
    window.removeEventListener('resize', this.handleResize)
  }
  /* 存放各类图表的基本信息 */
  addOption(key: ChartType, option: echarts.EChartsCoreOption) {
    this.#options.set(key, option)
  }
  /* 获取对应类型图表的基本信息 */
  getOption(key: ChartType) {
    return this.#options.get(key)
  }
}
export const chartsResize = new ChartsResize()

/* 声明一个开关 */
let initComplete = false

/* 使用Echarts（type：图表的类型 ，el:渲染图表的元素）*/
export const useCharts = ({ type, el, args }: ChartHookOption) => {
  /*
    注册必须的组件 (这里加判断为了保证只注册一次)
    需要注意的是为了保证打包的体积是最小的，ECharts 按需引入的时候不再提供任何渲染器，所以需要选择引入 CanvasRenderer 或者 SVGRenderer 作为渲染器。这样的好处是假如你只需要使用 svg 渲染模式，打包的结果中就不会再包含无需使用的CanvasRenderer模块
  */
  !initComplete &&
    echarts.use([
      BarChart,
      LineChart,
      PieChart,
      GaugeChart,
      TitleComponent,
      LegendComponent,
      TooltipComponent,
      GridComponent,
      DatasetComponent,
      TransformComponent,
      LabelLayout,
      UniversalTransition,
      CanvasRenderer,
      ToolboxComponent,
      GraphicComponent,
      DataZoomComponent
    ])

  /* 声明 echarts 实例变量 */
  const charts = useRef<echarts.ECharts | null>(null)

  /* 获取绘制图表的基本配置信息 */
  const getOptions = async () => {
    const moduleKey = `../options/${type}.ts`
    const { default: defaultOption } = await optionsModules[moduleKey]()
    return defaultOption
  }

  /**
   * @param opt 绘制图表的配置信息
   * @param currentChart 当前绘制图表的实例
   */
  const setOptions = async (opt: echarts.EChartsCoreOption, currentChart?: echarts.ECharts) => {
    if (Object.keys(opt).length) {
      const fullOpt = merge(chartsResize.getOption(type!)!, opt)
      console.log('绘制图表')
      /* fullOpt => 绘制图表的完整配置信息(带有数据) */
      if (initComplete) {
        if (currentChart) {
          currentChart.setOption(fullOpt)
        } else {
          charts.current?.setOption(fullOpt)
        }
      }
    }
  }

  /**
   * @description 初始化注册图表交互事件
   * @description ECharts 支持常规的鼠标事件类型，包括 'click'、 'dblclick'、 'mousedown'、 'mousemove'、 'mouseup'、 'mouseover'、 'mouseout'、 'globalout'、 'contextmenu' 事件
   */
  const initEvent = (charts: echarts.ECharts) => {
    Object.keys(args || {}).forEach((attrKey) => {
      const cb = args![attrKey]
      /* 如果cb为函数的话，则绑定事件 */
      typeof cb === 'function' && charts?.on(attrKey.toLowerCase(), cb as () => void)
    })
  }

  /* 初始化图表 */
  const initChart = () => {
    return new Promise(async (resolve, reject) => {
      /* 如果已经初始化过图表 则直接 return */
      if (charts.current) return resolve(charts.current)

      /* 初始化echarts实例 (el => 渲染的元素) */
      charts.current = echarts.init(el.current)

      /* 获取绘制图表的基本配置信息 (需要深度拷贝) */
      const options = cloneDeep(await getOptions())

      /* 存储图表的基本配置信息 */
      if (!chartsResize.getOption(type!)) {
        chartsResize.addOption(type!, options)
      }

      /* 绘制图表 (此时绘制的图表数据是基本配置信息) */
      charts.current.setOption(options)

      /* 将图表实例添加到缓存中 */
      chartsResize.addChart(charts.current)

      /* 添加事件支持 */
      initEvent(charts.current)

      /* 开关打开 */
      initComplete = true

      resolve(charts.current)
    })
  }

  useEffect(() => {
    return () => {
      /* 组件销毁时要把图表实例移除缓存 */
      chartsResize.removeChart(charts.current!)
      /* 销毁监听视口缩放事件 */
      // chartsResize.removeListener()
    }
  }, [])

  return {
    charts,
    initChart,
    setOptions,
    initEvent
  }
}

export const chartsOptions = <T extends echarts.EChartsCoreOption>(option: T) => <T>option

export type * from '../types'
