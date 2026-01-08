import {
  AmazonOutlined,
  AntDesignOutlined,
  CodepenCircleOutlined,
  CodeSandboxOutlined,
  GoogleOutlined,
  IeOutlined,
  SketchOutlined,
  SlackOutlined
} from '@ant-design/icons'
import classnames from 'classnames'

import AntIcon from '@/components/AntIcon'

import moduleScss from './index.module.scss'

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
const iconList = [
  {
    icon: AmazonOutlined
  },
  {
    icon: AntDesignOutlined
  },
  {
    icon: CodepenCircleOutlined
  },
  {
    icon: CodeSandboxOutlined
  },
  {
    icon: GoogleOutlined
  },
  {
    icon: IeOutlined
  },
  {
    icon: SketchOutlined
  },
  {
    icon: SlackOutlined
  }
]

const Scss: React.FC = () => {
  const [type, setType] = useState('icon-yasuoji')

  const handleClick = () => {
    const str = type === 'icon-yasuoji' ? 'icon-jianpaifanganguanli' : 'icon-yasuoji'
    setType(str)
  }

  return (
    <>
      <div className={moduleScss.scss}>
        {/* scss 样式继承 */}
        <div className='alert-success'>Success Text</div>
        <div className='alert-info'>Info Text</div>
        <div className='alert-warning'>Warning Text</div>
        <div className='alert-error'>Error Text</div>

        {/* scss变量 手动引入 */}
        <Table pagination={{ total: 500 }} dataSource={dataSource} columns={columns} />

        {/* scss 数学函数 环形菜单 */}
        <div className={moduleScss.annular}>
          <AntIcon type='icon-tianranqifadianV1' />
          <div className={classnames(moduleScss.inner, 'pos-inset')}></div>
          <div className={classnames(moduleScss.outer, 'pos-inset')}></div>
          <div className={classnames(moduleScss.icon)}>
            {iconList.map((item, index) => (
              <item.icon
                key={index}
                style={{
                  color: `var(--color-custom${index + 1})`
                }}
              />
            ))}
          </div>
        </div>

        {/* 阿里巴巴矢量图标库使用 */}
        <Space wrap>
          <div className={moduleScss['ant-icon']}>
            <Button style={{ color: '#ffffff' }} type='primary' onClick={handleClick}>
              切换icon
            </Button>
            <AntIcon type='icon-Vector' />
            <AntIcon type='icon-lenglianghuishou21' rotate={90} />
            <AntIcon type='icon-paifangyuanguanli' spin />
            <AntIcon
              type='icon-zhilengshebei'
              style={{
                color: `var(--color-custom1)`
              }}
            />
            <AntIcon type={type} />
            <AntIcon type='icon-tanzichanguanli' />
            <AntIcon type='icon-tanzonglan' />
            <AntIcon type='icon-tanzhonghe' />
          </div>
        </Space>
      </div>
    </>
  )
}

export default Scss
