import { getLineData } from '@/api/home-screen'
import { chartsOptions, LineECOption } from '@/components/VCharts/hooks/echarts.config'

export const UseChartDataLine = () => {
  /* 存储图表基本配置信息 */
  const initOpt = chartsOptions<LineECOption>({})
  const [optionsLine, setOptionsLine] = useState<LineECOption>(initOpt)

  const getData = async () => {
    try {
      const res: ReturnType<typeof getLineData> = getLineData()
      const result = await res
      if (result.code === 200) {
        const seriesArr = [
          { name: '流水', value: 'money' },
          { name: '订单', value: 'order' }
        ]
        const series: LineECOption['series'] = seriesArr.map((item) => {
          return {
            name: item.name,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            smooth: true,
            emphasis: { focus: 'series' },
            data: result.data?.[item.value]
          }
        })
        const optionData: LineECOption = {
          tooltip: { trigger: 'axis' },
          legend: {
            top: '0%',
            data: seriesArr.map((item) => item.name.toString())
          },
          grid: {
            top: '12%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: result.data?.label
            }
          ],
          yAxis: [{ type: 'value' }],
          series
        }
        setOptionsLine(optionData)
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  return {
    getData,
    optionsLine
  }
}
