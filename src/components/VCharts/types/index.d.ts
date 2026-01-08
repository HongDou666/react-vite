/* 两个类型用于配置图表的坐标轴相关的选项（例如 x 轴和 y 轴的各种显示样式、刻度设置、标签设置等内容）*/
import { XAXisComponentOption, YAXisComponentOption } from 'echarts'
/* 系列类型的定义后缀都为 SeriesOption */
import type {
  BarSeriesOption, // 柱状图
  FunnelSeriesOption, // 漏斗图
  GaugeSeriesOption, // 仪表盘图
  LineSeriesOption, // 折线图
  PieSeriesOption // 饼图
} from 'echarts/charts'
/* 组件类型的定义后缀都为 ComponentOption */
import type {
  AriaComponentOption,
  AxisPointerComponentOption,
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components'
/* 通过引入 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型 */
import type { ComposeOption } from 'echarts/core'
/* 处理与图表元素相关的事件以及对应的数据传递逻辑，确保代码在类型层面的正确性 */
import { ECElementEvent, HighlightPayload, SelectChangedPayload } from 'echarts/types/src/util/types'

type Options = LineECOption | BarECOption | PieECOption | FunnelOption

type BaseOptionType =
  | XAXisComponentOption
  | YAXisComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption

type BaseOption = echarts.ComposeOption<BaseOptionType>

type LineECOption = echarts.ComposeOption<LineSeriesOption | BaseOptionType>

type BarECOption = echarts.ComposeOption<BarSeriesOption | BaseOptionType>

type PieECOption = echarts.ComposeOption<PieSeriesOption | BaseOptionType>

type FunnelOption = echarts.ComposeOption<FunnelSeriesOption | BaseOptionType>

type GaugeECOption = echarts.ComposeOption<GaugeSeriesOption | GridComponentOption>

type EChartsOption = echarts.EChartsOption

type ChartType = 'bar' | 'line' | 'pie' | 'gauge'

type EventParams = {
  // 当前点击的图形元素所属的组件名称，
  // 其值如 'series'、'markLine'、'markPoint'、'timeLine' 等。
  componentType: string
  // 系列类型。值可能为：'line'、'bar'、'pie' 等。当 componentType 为 'series' 时有意义。
  seriesType: string
  // 系列在传入的 option.series 中的 index。当 componentType 为 'series' 时有意义。
  seriesIndex: number
  // 系列名称。当 componentType 为 'series' 时有意义。
  seriesName: string
  // 数据名，类目名
  name: string
  // 数据在传入的 data 数组中的 index
  dataIndex: number
  // 传入的原始数据项
  data: Object
  // sankey、graph 等图表同时含有 nodeData 和 edgeData 两种 data，
  // dataType 的值会是 'node' 或者 'edge'，表示当前点击在 node 还是 edge 上。
  // 其他大部分图表中只有一种 data，dataType 无意义。
  dataType: string
  // 传入的数据值
  value: number | Array
  // 数据图形的颜色。当 componentType 为 'series' 时有意义。
  color: string
}

namespace ChartsEvents {
  /* 鼠标事件类型 */
  type MouseEventType =
    | 'click'
    | 'dblclick'
    | 'mousedown'
    | 'mousemove'
    | 'mouseup'
    | 'mouseover'
    | 'mouseout'
    | 'globalout'
    | 'contextmenu'

  type MouseEvents = {
    [key in Exclude<MouseEventType, 'globalout' | 'contextmenu'> as `chart${Capitalize<key>}`]: ECElementEvent
  }

  /* 其他的事件类型及其参数 */
  interface Events extends MouseEvents {
    globalout: ECElementEvent
    contextmenu: ECElementEvent
    selectchanged: SelectChangedPayload
    highlight: HighlightPayload
    legendselected: {
      /* 图例选中后的事件 */
      type: 'legendselected'
      /* 选中的图例名称 */
      name: string
      /* 所有图例的选中状态表 */
      selected: {
        [name: string]: boolean
      }
    }
    /* ... 其他类型的事件在这里定义 */
  }

  /* echarts所有的事件类型 */
  type EventType = keyof Events
  /*
    interface EventEmitsType {
      <T extends EventType>(e: `on${T}`, event: Events[Uncapitalize<T>]): void
    }
  */
}

export {
  BaseOption,
  ChartType,
  LineECOption,
  BarECOption,
  Options,
  PieECOption,
  FunnelOption,
  GaugeECOption,
  EChartsOption,
  ChartsEvents,
  EventParams
}
