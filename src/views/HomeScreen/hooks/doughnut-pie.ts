import { getPieAgeData } from '@/api/home-screen'
import { chartsOptions, PieECOption } from '@/components/VCharts/hooks/echarts.config'

export const UseChartDataDoughnutPie = () => {
  /* 存储图表基本配置信息 */
  const initOpt1 = chartsOptions<PieECOption>({})
  const [optionsDougPie, setOptionsDougPie] = useState<PieECOption>(initOpt1)

  const getData = async () => {
    try {
      const res: ReturnType<typeof getPieAgeData> = getPieAgeData()
      const result = await res
      if (result.code === 200) {
        const optionData: PieECOption = {
          tooltip: { trigger: 'item' },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: '0%',
            top: '0%'
          },
          series: [
            {
              name: 'Nightingale Chart',
              type: 'pie',
              radius: ['30%', '70%'],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: { borderRadius: 2 },
              data: [
                { value: 40, name: 'rose 1' },
                { value: 38, name: 'rose 2' },
                { value: 32, name: 'rose 3' },
                { value: 30, name: 'rose 4' },
                { value: 28, name: 'rose 5' },
                { value: 26, name: 'rose 6' },
                { value: 22, name: 'rose 7' },
                { value: 18, name: 'rose 8' }
              ]
            }
          ]
        }
        setOptionsDougPie(optionData)
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  return {
    getData,
    optionsDougPie
  }
}
