/* 直接全量引入（不推荐，会导致打包体积过大） */
// import * as Icons from '@ant-design/icons'

import {
  AntDesignOutlined,
  BarChartOutlined,
  CodeSandboxOutlined,
  DockerOutlined,
  FileDoneOutlined,
  HomeOutlined,
  Html5Outlined,
  PartitionOutlined,
  SlidersOutlined,
  SpotifyOutlined,
  TranslationOutlined,
  TwitchOutlined,
  WifiOutlined
} from '@ant-design/icons'

const IconMap = {
  Plugin: CodeSandboxOutlined,
  React: DockerOutlined,
  Echarts: BarChartOutlined,
  Home: HomeOutlined,
  I18n: TranslationOutlined,
  Redux: PartitionOutlined,
  Axios: WifiOutlined,
  Css: Html5Outlined,
  RichText: FileDoneOutlined,
  Business: TwitchOutlined,
  TanStackQuery: AntDesignOutlined,
  KeepAlive: SpotifyOutlined,
  Event: SlidersOutlined
}

export default IconMap
