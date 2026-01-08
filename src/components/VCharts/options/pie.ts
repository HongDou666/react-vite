import { PieECOption } from '../types'

/* 饼图 默认配置 */
const options: PieECOption = {
  title: {},
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      label: {
        fontSize: 12
      },
      labelLine: {
        length: 18,
        length2: 0,
        maxSurfaceAngle: 80,
        lineStyle: {
          width: 2
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      startAngle: 0,
      minShowLabelAngle: 0,
      data: []
    }
  ]
}

export default options
