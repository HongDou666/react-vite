import * as echarts from 'echarts/core'
import { debounce } from 'lodash-es'

import { ChartType, useCharts } from './hooks/echarts.config'

interface ComponentProps {
  type: ChartType
  options: echarts.EChartsCoreOption
  customEvent?: (chart: echarts.ECharts) => void
  [event: string]: any
}

const chartMap = new WeakMap()

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const target = chartMap.get(entry.target)
    if (target && target.flag) {
      target.callBack()
    } else {
      target.flag = true
    }
  }
})

const VCharts: React.FC<React.PropsWithChildren<ComponentProps>> = ({
  type = 'bar',
  options = {},
  customEvent,
  ...args
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts | null>(null)
  const chartResize = useRef(
    debounce(() => {
      charts.current?.resize()
    }, 100)
  ).current
  const { charts, setOptions, initChart } = useCharts({ type, el: chartRef, args })

  const loadChart = useCallback(async () => {
    if (chart.current) {
      return setOptions(options, chart.current) /* 绘制图表 */
    }
    try {
      chart.current = (await initChart()) as echarts.ECharts
      setOptions(options, chart.current) /* 绘制图表 */
      customEvent && customEvent(chart.current) /* 自定义事件 由外部使用 */
    } catch (error) {
      console.error(error)
    }
  }, [options, setOptions, initChart, customEvent])

  useEffect(() => {
    loadChart()
  }, [loadChart])

  /* 监听图表尺寸变化 */
  useEffect(() => {
    const current = chartRef.current
    if (!chartMap.get(current!)) {
      chartMap.set(current!, { flag: false, callBack: chartResize })
      resizeObserver.observe(current!)
    }
    return () => {
      resizeObserver.unobserve(current!)
      chartMap.delete(current!)
    }
  }, [chartResize])

  return (
    <div
      ref={chartRef}
      className='v-charts'
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100px'
      }}
    />
  )
}

export default memo(VCharts)
