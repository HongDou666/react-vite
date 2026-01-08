import {
  BarECOption,
  BaseOption,
  ChartsEvents,
  chartsOptions,
  ChartType,
  EChartsOption,
  FunnelOption,
  GaugeECOption,
  LineECOption,
  Options,
  PieECOption
} from '@/components/VCharts/hooks/echarts.config'

export const UseChartDataLine = () => {
  /* 存储图表基本配置信息 */
  const initOpt = chartsOptions<LineECOption>({})
  const [options, setOptions] = useState<LineECOption>(initOpt)

  const getData = async (params) => {
    /* 假设真实数据 2 秒后返回 */
    setTimeout(() => {
      const data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const series: LineECOption['series'] = [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: 'Direct',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [320, 332, 301, 334, 390, 330, 320]
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
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
      const result: LineECOption = {
        title: {},
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
        yAxis: [
          {
            type: 'value'
          }
        ],
        series
      }
      setOptions(result)
    }, 2000)
  }

  return {
    getData,
    options
  }
}
