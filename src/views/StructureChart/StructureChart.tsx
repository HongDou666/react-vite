/*
  react-organizational-chart: 轻松构建 React 组织结构图
  参考文献1: https://blog.csdn.net/gitblog_00175/article/details/146642958
  参考文献2: https://gitcode.com/gh_mirrors/re/react-organizational-chart/?utm_source=artical_gitcode&index=bottom&type=card&#components
*/

import { Tree, TreeNode } from 'react-organizational-chart'
import styled from 'styled-components'

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid red;
`

const props = {
  lineWidth: '2px', // 线宽
  lineColor: '#00a76f', // 线条颜色
  lineBorderRadius: '5px', // 线条拐点弧度
  lineHeight: '30px', // 节点之间的高度间距
  nodePadding: '5px', // 节点之间的左右间距
  lineStyle: 'solid', // 线条样式 solid/dotted
  label: <StyledNode>Root</StyledNode>
}

const StructureChart: React.FC = () => {
  return (
    <>
      <Card title='组织结构图'>
        <Tree {...props}>
          <TreeNode label={<StyledNode>Child 1</StyledNode>}>
            <TreeNode label={<StyledNode>Grand Child</StyledNode>} />
          </TreeNode>
          <TreeNode label={<StyledNode>Child 2</StyledNode>}>
            <TreeNode label={<StyledNode>Grand Child</StyledNode>}>
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
            </TreeNode>
          </TreeNode>
          <TreeNode label={<StyledNode>Child 3</StyledNode>}>
            <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
            <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
          </TreeNode>
        </Tree>
      </Card>
    </>
  )
}

export default StructureChart
