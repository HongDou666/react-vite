import { RefObject, useRef } from 'react'
import { useMount, useUpdateEffect } from 'ahooks'
import { graphic } from 'echarts'

import { useAppSelector } from '@/hooks/business/useStore'
import { useEcharts } from '@/hooks/common/echarts'
import { BarECOption, ChartsEvents, EventParams, LineECOption } from '@/hooks/common/type'
import { getLocale } from '@/store-rtk/modules/app'

const EchartsDemo3: React.FC = () => {
  const locale = useAppSelector(getLocale)
  const [show, setShow] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>()
  const events = useRef({
    /* 点击图例（切换图例选中状态后的事件）*/
    legendselectchanged: (params?: ChartsEvents.Events['selectchanged']) => {
      console.log('选中图例', params)
    },
    /* 点击事件 */
    click: (params?: EventParams) => {
      const zoomSize = 6
      const chartOption = chart.current?.getOption()
      if (!chartOption) return
      const dataAxis = chartOption.xAxis?.[0]?.data || []
      const data = chartOption.series?.[0]?.data || []

      chart.current?.dispatchAction({
        type: 'dataZoom',
        startValue: dataAxis[Math.max(params!.dataIndex - zoomSize / 2, 0)],
        endValue: dataAxis[Math.min(params!.dataIndex + zoomSize / 2, data.length - 1)]
      })
    },
    /* 双击事件 */
    dblclick: (params?: EventParams) => {
      console.log('双击事件', params)
    },
    /* 鼠标按下事件 */
    mousedown: (params?: EventParams) => {
      console.log('鼠标按下事件', params)
    },
    /* 鼠标抬起事件 */
    mouseup: (params?: EventParams) => {
      console.log('鼠标抬起事件', params)
    },
    /* 鼠标移入事件 */
    mouseover: (params?: EventParams) => {
      // console.log('鼠标移入事件', params)
    },
    /* 鼠标移动事件 */
    mousemove: (params?: EventParams) => {
      // console.log('鼠标移动事件', params)
    },
    /* 鼠标移出事件 */
    mouseout: (params?: EventParams) => {
      // console.log('鼠标移出事件', params)
    },
    /* 全局out事件 相当于移出整个图表 */
    globalout: (params?: EventParams) => {
      // console.log('全局out事件', params)
    },
    /* 右键事件 */
    contextmenu: (params?: EventParams) => {
      console.log('右键事件', params)
    }
  })
  const optionsBar = useRef<BarECOption>({
    legend: {},
    tooltip: { trigger: 'axis' },
    grid: {
      left: 10,
      right: 10,
      bottom: 10,
      top: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: { color: '#7D8292' },
      axisLine: { lineStyle: { color: '#C8D0D7' } },
      axisTick: { alignWithLabel: false },
      boundaryGap: true
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: '#C8D0D7', type: 'dashed' }
      },
      axisLine: {}
    },
    series: []
  })
  const optionsLine = useRef<LineECOption>({
    legend: {},
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 10,
      top: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        color: '#7D8292'
      },
      axisLine: {
        lineStyle: {
          color: '#C8D0D7'
        }
      },
      axisTick: { alignWithLabel: false }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#C8D0D7',
          type: 'dashed'
        }
      },
      axisLine: {}
    },
    series: []
  })
  const { domRef, chart, updateOptions } = useEcharts((() => optionsBar.current) as () => BarECOption, {
    onEvents: events.current
  })
  const {
    domRef: domRef_01,
    updateOptions: updateOptions_01,
    destroy,
    setOptions
  } = useEcharts((() => optionsLine.current) as () => LineECOption)
  const mockList = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]

  useEffect(() => {
    if (!show) {
      destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  /* 随机打乱一个数组 */
  const scrambleArray = (arr: number[]) => {
    return arr.sort(() => Math.random() - 0.5) || []
  }
  const handleRefresh = () => {
    mockDataBar()
  }
  const handleRefresh_01 = () => {
    mockDataLine()
  }
  const handleAction = () => {
    if (timer.current) {
      clearInterval(timer.current!)
    }
    let currentIndex = -1
    const dataLen = (optionsBar.current?.xAxis as any).data?.length
    timer.current = setInterval(() => {
      /* 取消之前高亮的图形 */
      chart?.current?.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex % dataLen
      })
      currentIndex++
      /* 高亮当前图形 */
      chart?.current?.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex % dataLen
      })
      /* 显示 tooltip */
      chart?.current?.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex % dataLen
      })
    }, 500)
  }

  async function mockDataBar() {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    const data: number[] = scrambleArray(mockList)
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

    updateOptions((opts) => {
      return Object.assign(opts, result)
    })
  }

  async function mockDataLine() {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })

    const data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dataList = [120, 132, 101, 134, 90, 230, 210]
    const series: LineECOption['series'] = [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: scrambleArray(dataList)
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: scrambleArray(dataList)
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: scrambleArray(dataList)
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: scrambleArray(dataList)
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: scrambleArray(dataList)
      }
    ]
    const result: LineECOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data
        }
      ],
      yAxis: [{ type: 'value' }],
      series
    }

    updateOptions_01((opts) => {
      return Object.assign(opts, result)
    })
  }

  function init() {
    mockDataBar()
    mockDataLine()
  }

  /* 只在组件初始化时执行的 Hook */
  useMount(() => {
    init()
  })

  /* 监听 locale 的变化，更新图表配置 */
  useUpdateEffect(() => {}, [locale])

  return (
    <Card bordered className='card-wrapper'>
      <Space direction='vertical' className='flex'>
        <Space>
          <Button type='primary' onClick={handleRefresh}>
            刷新
          </Button>
          <Button type='primary' onClick={handleAction}>
            轮询
          </Button>
        </Space>
        <div className='h-360px overflow-hidden' ref={domRef} />
        <Space>
          <Button type='primary' onClick={handleRefresh_01}>
            刷新
          </Button>
          <Button
            type='primary'
            onClick={() => {
              setShow(!show)
            }}>
            显示/隐藏
          </Button>
        </Space>
        {show && <div className='h-360px overflow-hidden' ref={domRef_01} />}
      </Space>
    </Card>
  )
}

export default memo(EchartsDemo3)
