import { graphic } from 'echarts'

import {
  BarECOption,
  ChartsEvents,
  chartsOptions,
  EChartsOption,
  EventParams,
  GaugeECOption,
  PieECOption
} from '@/components/VCharts/hooks/echarts.config'

/* 模拟数据 */
const mockData = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]

export const UseChartDataBar = (chartBar) => {
  /* 存储图表基本配置信息 */
  const initOpt = chartsOptions<BarECOption>({})
  const [options, setOptions] = useState<BarECOption>(initOpt)

  /* 随机打乱一个数组 */
  const scrambleArray = (arr: number[]) => {
    return arr.sort(() => Math.random() - 0.5) || []
  }

  /* 生成 echarts 所需要的 options */
  const getData = async (params) => {
    /* 假设真实数据 1 秒后返回 */
    setTimeout(() => {
      const data: number[] = scrambleArray(mockData)
      const dataAxis = [
        '点',
        '击',
        '柱',
        '子',
        '或',
        '者',
        '两',
        '指',
        '在',
        '触',
        '屏',
        '上',
        '滑',
        '动',
        '能',
        '够',
        '自',
        '动',
        '缩',
        '放'
      ]
      const result: BarECOption = {
        title: {
          text: '特性示例：渐变色 阴影 点击缩放',
          textStyle: {
            fontSize: 16
          }
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: true,
            color: '#ffffff'
          },
          axisTick: { show: false },
          axisLine: { show: false },
          z: 10
        },
        yAxis: {
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#999' }
        },
        dataZoom: [{ type: 'inside' }],
        series: [
          {
            type: 'bar',
            name: '访问来源',
            showBackground: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#37dbbf' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#3365FF' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
              /*
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ])
              */
            },
            emphasis: {
              itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.3, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            data
          }
        ]
      }
      setOptions(result)
    }, 1000)
  }

  /*
    echarts 注册事件
    官网: https://echarts.apache.org/zh/api.html#events.legendselectchanged
  */

  /* 点击图例（切换图例选中状态后的事件） */
  const legendselectchanged = (params: ChartsEvents.Events['selectchanged']) => {
    console.log('选中图例', params)
  }

  /* 点击事件 */
  const click = (params: EventParams) => {
    console.log('点击事件', params, chartBar.current)
    const zoomSize = 6
    const dataAxis = chartBar.current.getOption()?.xAxis[0]?.data || []
    const data = chartBar.current?.getOption()?.series?.[0]?.data || []

    chartBar.current?.dispatchAction({
      type: 'dataZoom',
      startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
      endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
    })
  }
  /* 双击事件 */
  const dblclick = (params: EventParams) => {
    console.log('双击事件', params)
  }
  /* 鼠标按下事件 */
  const mousedown = (params: EventParams) => {
    console.log('鼠标按下事件', params)
  }
  /* 鼠标抬起事件 */
  const mouseup = (params: EventParams) => {
    console.log('鼠标抬起事件', params)
  }
  /* 鼠标移动事件 */
  const mousemove = (params: EventParams) => {
    // console.log('鼠标移动事件', params)
  }
  /* 鼠标移入事件 */
  const mouseover = (params: EventParams) => {
    // console.log('鼠标移入事件', params)
  }
  /* 鼠标移出事件 */
  const mouseout = (params: EventParams) => {
    // console.log('鼠标移出事件', params)
  }
  /* 全局out事件 相当于移出整个图表 */
  const globalout = (params: EventParams) => {
    // console.log('全局out事件', params)
  }
  /* 右键事件 */
  const contextmenu = (params: EventParams) => {
    console.log('右键事件', params)
  }

  return {
    options,
    getData,
    legendselectchanged,
    click,
    dblclick,
    mousedown,
    mousemove,
    mouseup,
    mouseover,
    mouseout,
    globalout,
    contextmenu
  }
}
