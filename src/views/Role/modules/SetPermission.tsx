import { RefObject } from 'react'
import { TikTokOutlined } from '@ant-design/icons'
import type { TreeDataNode, TreeProps } from 'antd'
import { Tree } from 'antd'

import { getMenuList } from '@/api/menu'
import { postUpdatePermission } from '@/api/role'
import { IMenu } from '@/types/api/menu'
import type { IPermission, IRole } from '@/types/api/role'

interface SetPermissionType {
  propsRef: RefObject<{ openModal: (type: string, data?: IRole) => void }>
  update: () => void
}

const SetPermission: React.FC<SetPermissionType> = (props) => {
  const [form] = Form.useForm()
  const [checkedKeys, setCheckKeys] = useState<string[]>([])
  const [menuList, setMenuList] = useState<IMenu[]>([])
  const [permission, setPermission] = useState<IPermission>()
  const [roleInfo, setRoleInfo] = useState<IRole>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useImperativeHandle(props.propsRef, () => ({ openModal }))

  // 获取菜单列表
  const getMenuList_ = useCallback(async () => {
    try {
      const res: ReturnType<typeof getMenuList> = getMenuList()
      const result = await res
      if (result.code === 200) {
        setMenuList(result.data!)
      } else {
        setMenuList([])
      }
    } catch (error: any) {
      console.error(error)
    }
  }, [])

  // 初始化数据
  useEffect(() => {
    getMenuList_()
  }, [getMenuList_])

  // 提交表单数据
  const handleOk = async () => {
    try {
      const validate = await form.validateFields({
        // 5.5.0新增 true:仅校验内容而不会将错误信息展示到 UI 上 (默认 false)
        validateOnly: false
      })
      if (validate) {
        setConfirmLoading(true)
        const params: Parameters<typeof postUpdatePermission>[0] = permission!
        const res: ReturnType<typeof postUpdatePermission> = postUpdatePermission(params)
        const result = await res
        setConfirmLoading(false)
        if (result.code === 200) {
          message.success('设置成功！')
          handleCancel()
          props.update()
        } else {
          message.error(result.msg || '网络异常！')
        }
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  // 关闭弹窗 & 重置表单
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  // 打开弹窗 & 初始化表单数据
  const openModal = (type: string, data?: IRole) => {
    setRoleInfo(data)
    setIsModalOpen(true)
    if (data) {
      setCheckKeys(data?.permissionList.checkedKeys || [])
      form.setFieldsValue(data)
    }
  }

  // 点击复选框触发
  const onCheck: TreeProps['onCheck'] = (checkedKeysValue, info: any) => {
    setCheckKeys(checkedKeysValue as string[])
    const checkedKeysTemp: string[] = []
    const halfCheckedKeysTemp: string[] = []
    info.checkedNodes.map((node: IMenu) => {
      if (node.menuType === 2) {
        checkedKeysTemp.push(node._id)
      } else {
        halfCheckedKeysTemp.push(node._id)
      }
    })
    setPermission({
      _id: roleInfo?._id || '',
      permissionList: {
        checkedKeys: checkedKeysTemp,
        halfCheckedKeys: halfCheckedKeysTemp.concat(info.halfCheckedKeys)
      }
    })
  }

  return (
    <>
      <Modal
        title={'设置权限'}
        okText='确定'
        cancelText='取消'
        maskClosable={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}>
        <Form
          autoComplete='off'
          className='search-form'
          labelAlign='right'
          style={{ maxHeight: 500, overflow: 'auto' }}
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}>
          <Form.Item label='角色名称'></Form.Item>
          <Form.Item label='权限'>
            <Tree
              checkable
              fieldNames={{
                key: '_id',
                children: 'children',
                title: 'menuName'
              }}
              defaultExpandAll
              onCheck={onCheck}
              checkStrictly={false}
              checkedKeys={checkedKeys}
              treeData={menuList as unknown as TreeDataNode[]}
              switcherIcon={<TikTokOutlined />}
              showLine={true}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SetPermission
