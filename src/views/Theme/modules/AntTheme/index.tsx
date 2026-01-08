import {
  CheckCircleTwoTone,
  HeartTwoTone,
  setTwoToneColor,
  SmileTwoTone,
  StarFilled,
  StarOutlined
} from '@ant-design/icons'
import type { ColorPickerProps, GetProp, MenuProps } from 'antd'
import classnames from 'classnames'

import moduleScss from './index.module.scss'

type Color = Extract<GetProp<ColorPickerProps, 'value'>, string | { cleared: any }>
type Format = GetProp<ColorPickerProps, 'format'>

const plainOptions = ['Apple', 'Pear', 'Orange']
const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target='_blank' rel='noopener noreferrer' href='https://www.antgroup.com'>
        1st menu item
      </a>
    )
  },
  {
    key: '2',
    label: (
      <a target='_blank' rel='noopener noreferrer' href='https://www.aliyun.com'>
        2nd menu item
      </a>
    )
  }
]
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  }
]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
]

const AntTheme: React.FC = () => {
  const { useToken } = theme
  const { token } = useToken()

  const [colorHex, setColorHex] = useState<Color>('#00b96b')
  const [formatHex, setFormatHex] = useState<Format | undefined>('hex')

  const hexString = useMemo<string>(() => {
    const color = typeof colorHex === 'string' ? colorHex : colorHex?.toHexString()

    /* 全局设置图标主色 */
    setTwoToneColor(color)
    return color
  }, [colorHex])

  const iconStyle = useMemo(
    () => ({
      fontSize: '28px',
      color: hexString
    }),
    [hexString]
  )

  return (
    <div className={moduleScss.antTheme}>
      <ConfigProvider
        theme={{
          /*
            默认算法 theme.defaultAlgorithm
            暗色算法 theme.darkAlgorithm
            紧凑算法 theme.compactAlgorithm
          */
          algorithm: [theme.defaultAlgorithm],
          components: {
            Checkbox: {
              colorPrimary: '#f40',
              algorithm: true // 启用算法
            }
          },
          token: {
            /* 主色 影响范围大  */
            colorPrimary: hexString,
            /* 基础组件的圆角大小，例如按钮、输入框、卡片等 */
            borderRadius: 5,
            /* 启用动画 */
            motion: true
          },
          /* antd 组件样式中一些原本具体的数值被替换为了 CSS 变量 */
          cssVar: true
        }}>
        <Space wrap>
          <ColorPicker
            showText
            format={formatHex}
            value={colorHex}
            onChange={setColorHex}
            onFormatChange={setFormatHex}
          />
          <span>切换 ant UI 主题颜色</span>
        </Space>

        <Space wrap>
          <Button type='primary'>Primary Button</Button>
          <Button>Default Button</Button>
          <ConfigProvider theme={{ token: { colorPrimary: '#ffb431' } }}>
            <Button type='primary'>拥有自己的主题色</Button>
          </ConfigProvider>
          <StarOutlined style={iconStyle} />
          <StarFilled style={iconStyle} />
          <SmileTwoTone twoToneColor={hexString} />
          <HeartTwoTone />
          <CheckCircleTwoTone />
          <Dropdown menu={{ items }} placement='bottomLeft'>
            <Button>bottomLeft</Button>
          </Dropdown>
          <Pagination defaultCurrent={6} total={500} />
          <Checkbox.Group options={plainOptions} defaultValue={['Apple']} />
          <Radio.Group value={1}>
            <Radio value={1} style={{ color: 'var(--color-custom3)' }}>
              A
            </Radio>
            <Radio value={2} style={{ color: 'var(--color-custom4)' }}>
              B
            </Radio>
            <Radio value={3} style={{ color: 'var(--color-custom5)' }}>
              C
            </Radio>
            <Radio value={4} style={{ color: 'var(--color-custom6)' }}>
              D
            </Radio>
          </Radio.Group>
          <DatePicker />
          <Select
            defaultValue='lucy'
            style={{ width: 120 }}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true }
            ]}
          />
          <div style={{ width: 180 }}>
            <Slider defaultValue={50} />
          </div>
          <Spin />
          <Table className='custom-theme' pagination={{ total: 500 }} dataSource={dataSource} columns={columns} />
        </Space>
        <div
          style={{
            backgroundColor: token.colorPrimaryBg,
            padding: token.padding,
            borderRadius: token.borderRadius,
            color: token.colorPrimaryText,
            fontSize: token.fontSize
          }}
          className={classnames('iconfont icon-zhushujuguanli icon-zixitongguanli', moduleScss.iconfont)}>
          使用 Design Token
        </div>
      </ConfigProvider>
    </div>
  )
}

export default AntTheme
