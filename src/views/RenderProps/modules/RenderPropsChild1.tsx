import React from 'react'
import type { DescriptionsProps } from 'antd'
import { Descriptions } from 'antd'

interface PropsType {
  isCollapsed: boolean
  handleCollapse: (collapse: boolean) => void
  title: string
}

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    children: 'Zhou Maomao'
  },
  {
    key: '2',
    label: 'Telephone',
    children: '1810000000'
  },
  {
    key: '3',
    label: 'Live',
    children: 'Hangzhou, Zhejiang'
  },
  {
    key: '4',
    label: 'Remark',
    children: 'empty'
  },
  {
    key: '5',
    label: 'Address',
    children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China'
  }
]

const RenderPropsChild1: React.FC<PropsType> = ({ isCollapsed, handleCollapse, title }) => {
  return (
    <>
      <div>
        <Button type='primary' onClick={() => handleCollapse(!isCollapsed)}>
          {isCollapsed ? '展开' : '收起'}
        </Button>
        {!isCollapsed && <Descriptions bordered title={title} items={items} />}
      </div>
    </>
  )
}

export default RenderPropsChild1
