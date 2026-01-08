import { useMount, useUpdateEffect } from 'ahooks'

import { useAppSelector } from '@/hooks/business/useStore'
import { useEcharts } from '@/hooks/common/echarts'
import { getLocale } from '@/store-rtk/modules/app'

const EchartsDemo2: React.FC = () => {
  const locale = useAppSelector(getLocale)
  const { domRef, updateOptions } = useEcharts(() => ({
    grid: {
      bottom: '3%',
      containLabel: true,
      left: '3%',
      right: '4%'
    },
    legend: { data: ['下载量', '注册量'] },
    series: [
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#8e9dff',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#8e9dff',
        data: [] as number[],
        emphasis: {
          focus: 'series'
        },
        name: '下载量',
        smooth: true,
        stack: 'Total',
        type: 'line'
      },
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#26deca',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#26deca',
        data: [],
        emphasis: {
          focus: 'series'
        },
        name: '注册量',
        smooth: true,
        stack: 'Total',
        type: 'line'
      }
    ],
    tooltip: {
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        },
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      boundaryGap: false,
      data: [] as string[],
      type: 'category'
    },
    yAxis: {
      type: 'value'
    }
  }))

  async function mockData() {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    updateOptions((opts) => {
      opts.xAxis.data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
      opts.series[0].data = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311]
      opts.series[1].data = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678]

      return opts
    })
  }

  function init() {
    mockData()
  }

  function updateLocale() {
    updateOptions((opts, factory) => {
      const originOpts = factory()
      opts.legend.data = originOpts.legend.data
      opts.series[0].name = originOpts.series[0].name
      opts.series[1].name = originOpts.series[1].name

      return opts
    })
  }

  /* 只在组件初始化时执行的 Hook */
  useMount(() => {
    init()
  })

  /* 监听 locale 的变化，更新图表配置 */
  useUpdateEffect(() => {
    updateLocale()
  }, [locale])

  return (
    <Card bordered className='card-wrapper'>
      <div className='h-360px overflow-hidden' ref={domRef} />
    </Card>
  )
}

export default memo(EchartsDemo2)
