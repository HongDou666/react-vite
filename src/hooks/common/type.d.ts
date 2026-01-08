/* 两个类型用于配置图表的坐标轴相关的选项（例如 x 轴和 y 轴的各种显示样式、刻度设置、标签设置等内容）*/
import { XAXisComponentOption, YAXisComponentOption } from 'echarts'
/* 导入不同类型的图表选项类型（如 BarSeriesOption 表示柱状图的选项类型） */
import type {
  BarSeriesOption, // 柱状图选项类型
  FunnelSeriesOption, // 漏斗图选项类型
  GaugeSeriesOption, // 仪表盘选项类型
  LineSeriesOption, // 折线图选项类型
  PictorialBarSeriesOption, // 象形柱图选项类型
  PieSeriesOption, // 饼图选项类型
  RadarSeriesOption, // 雷达图选项类型
  ScatterSeriesOption // 散点图选项类型
} from 'echarts/charts'
/* 导入组件的选项类型，用于类型检查 */
import type {
  AriaComponentOption, // 无障碍访问组件选项类型，用于定义无障碍访问的配置项和样式
  AxisPointerComponentOption, // 坐标轴指示器组件选项类型，用于定义坐标轴指示器的配置项和样式
  DatasetComponentOption, // 数据集组件选项类型，用于定义数据集的配置项和样式
  GridComponentOption, // 网格组件选项类型，用于定义网格的配置项和样式
  LegendComponentOption, // 图例组件选项类型，用于定义图例的配置项和样式
  TitleComponentOption, // 标题组件选项类型，用于定义标题的配置项和样式
  ToolboxComponentOption, // 工具箱组件选项类型，用于定义工具箱的配置项和样式
  TooltipComponentOption // 提示框组件选项类型，用于定义提示框的配置项和样式
} from 'echarts/components'
/* 通过引入 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型 */
import type { ComposeOption } from 'echarts/core'
/* 处理与图表元素相关的事件以及对应的数据传递逻辑，确保代码在类型层面的正确性 */
import { ECElementEvent, HighlightPayload, SelectChangedPayload } from 'echarts/types/src/util/types'

/* 图表配置类型定义，用于确保图表配置的完整性和正确性 */
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption // 柱状图选项类型，用于定义柱图的配置项和样式
  | LineSeriesOption // 折线图选项类型，用于定义折线的配置项和样式
  | PieSeriesOption // 饼图选项类型，用于定义饼图的配置项和样式
  | ScatterSeriesOption // 散点图选项类型，用于定义散点的配置项和样式
  | PictorialBarSeriesOption // 象形柱图选项类型，用于定义象形柱图的配置项和样式
  | RadarSeriesOption // 雷达图选项类型，用于定义雷达图的配置项和样式
  | GaugeSeriesOption // 仪表盘选项类型，用于定义仪表盘的配置项和样式
  | TitleComponentOption // 标题组件选项类型，用于定义标题的配置项和样式
  | LegendComponentOption // 图例组件选项类型，用于定义图例的配置项和样式
  | TooltipComponentOption // 提示框组件选项类型，用于定义提示框的配置项和样式
  | GridComponentOption // 网格组件选项类型，用于定义网格的配置项和样式
  | ToolboxComponentOption // 工具箱组件选项类型，用于定义工具箱的配置项和样式
  | DatasetComponentOption // 数据集组件选项类型，用于定义数据集的配置项和样式
  | FunnelSeriesOption // 漏斗图选项类型，用于定义漏斗图的配置项和样式
  | AriaComponentOption // 无障碍访问组件选项类型，用于定义无障碍访问的配置项和样式
  | AxisPointerComponentOption // 坐标轴指示器组件选项类型，用于定义坐标轴指示器的配置项和样式
>

type Options =
  | LineECOption
  | BarECOption
  | PieECOption
  | FunnelOption
  | RadarECOption
  | GaugeECOption
  | ScatterECOption
  | PictorialBarECOption

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

type RadarECOption = echarts.ComposeOption<RadarSeriesOption | BaseOptionType>

type PictorialBarECOption = echarts.ComposeOption<PictorialBarSeriesOption | BaseOptionType>

type ScatterECOption = echarts.ComposeOption<ScatterSeriesOption | BaseOptionType>

type FunnelOption = echarts.ComposeOption<FunnelSeriesOption | BaseOptionType>

type GaugeECOption = echarts.ComposeOption<GaugeSeriesOption | GridComponentOption>

type EChartsOption = echarts.EChartsOption

type ChartType = 'bar' | 'line' | 'pie' | 'gauge' | 'funnel' | 'radar' | 'scatter' | 'pictorialBar'

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
  value: number | Array<string | number>
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

export type {
  BarSeriesOption,
  FunnelSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption,
  AriaComponentOption,
  AxisPointerComponentOption,
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  BaseOption,
  ChartType,
  LineECOption,
  BarECOption,
  Options,
  PieECOption,
  FunnelOption,
  GaugeECOption,
  EChartsOption,
  RadarECOption,
  PictorialBarECOption,
  ScatterECOption,
  ChartsEvents,
  EventParams
}
