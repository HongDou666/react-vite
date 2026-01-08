import { RefObject } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

import { getMenuList, postMenuCreate, postMenuEdit } from '@/api/menu'
import type { IMenu } from '@/types/api/menu'

interface FieldType {
  menuType: number
  menuName: string
  component: string
  icon: string
  path: string
  menuCode: string
  orderBy: number
  menuState: number
  parentId: string | null
  _id: string
}
interface MenuFormPropsType {
  propsRef: RefObject<{ openModal: (type: string, data?: IMenu | { parentId: string }) => void }>
  update: () => void
}

const MenuForm: React.FC<MenuFormPropsType> = (props) => {
  const [form] = Form.useForm()
  const [action, setAction] = useState<string>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [menuList, setMenuList] = useState<IMenu[]>()

  useImperativeHandle(props.propsRef, () => ({ openModal }))

  // 获取菜单列表
  const getMenuList_ = async () => {
    try {
      const res: ReturnType<typeof getMenuList> = getMenuList()
      const result = await res
      if (result.code === 200) {
        setMenuList(result.data!)
      } else {
        setMenuList([])
      }
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  // 提交表单数据
  const handleOk = async () => {
    try {
      const validate = await form.validateFields({
        // 5.5.0新增 true:仅校验内容而不会将错误信息展示到 UI 上 (默认 false)
        validateOnly: false
      })
      if (validate) {
        setConfirmLoading(true)
        let result
        if (action === 'create') {
          // 创建部门
          const param: Parameters<typeof postMenuCreate>[0] = validate
          const res: ReturnType<typeof postMenuCreate> = postMenuCreate(param)
          result = await res
        } else if (action === 'edit') {
          // 编辑部门
          const param: Parameters<typeof postMenuEdit>[0] = form.getFieldsValue() // form.getFieldsValue() 获取表单中收集的数据
          const res: ReturnType<typeof postMenuEdit> = postMenuEdit(param)
          result = await res
        }
        setConfirmLoading(false)
        if (result.code === 200) {
          message.success(action === 'create' ? '添加成功！' : '修改成功！')
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

  // 打开弹窗 & 获取部门列表
  const openModal = (type: string, data?: IMenu | { parentId: string }) => {
    setAction(type)
    getMenuList_()
    setIsModalOpen(true)
    if (data) {
      form.setFieldsValue(data)
    }
  }

  return (
    <div>
      <Modal
        title={action === 'create' ? '添加菜单' : '编辑菜单'}
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
          labelAlign='left'
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ menuType: 1, menuState: 1 }}>
          <Form.Item<FieldType> hidden name='_id'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='上级菜单'
            name='parentId'
            validateTrigger='onChange'
            rules={[{ required: true, message: '上级菜单必填！' }]}>
            <TreeSelect
              allowClear
              placeholder='请选择父级菜单'
              treeDefaultExpandAll
              treeData={menuList}
              fieldNames={{ label: 'menuName', value: '_id' }}
            />
          </Form.Item>
          <Form.Item<FieldType> label='菜单类型' name='menuType'>
            <Radio.Group>
              <Radio value={1}>菜单</Radio>
              <Radio value={2}>按钮</Radio>
              <Radio value={3}>页面</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='菜单名称'
            name='menuName'
            validateTrigger='onBlur'
            rules={[{ required: true, message: '菜单名称必填！' }]}>
            <Input placeholder='请输入菜单名称' />
          </Form.Item>
          {/*
            1. noStyle 为 true 时不带样式，作为纯字段控件使用
            2. shouldUpdate 为 true 时，Form 的任意变化都会使该 Form.Item 重新渲染; 要注意 Form.Item 里包裹的子组件必须由函数返回，否则 shouldUpdate 不会起作用
          */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              return form.getFieldValue('menuType') === 2 ? (
                <Form.Item<FieldType> label='权限标识' name='menuCode'>
                  <Input placeholder='请输入权限标识' />
                </Form.Item>
              ) : (
                <>
                  <Form.Item<FieldType> label='菜单图标' name='icon'>
                    <Input placeholder='请输入菜单图标' />
                  </Form.Item>
                  <Form.Item<FieldType> label='路由地址' name='path'>
                    <Input placeholder='请输入路由地址' />
                  </Form.Item>
                </>
              )
            }}
          </Form.Item>
          <Form.Item<FieldType> label='组件名称' name='component'>
            <Input placeholder='请输入组件名称' />
          </Form.Item>
          <Form.Item<FieldType>
            label='排序'
            name='orderBy'
            tooltip={{ title: '排序值越大越靠后', icon: <InfoCircleOutlined /> }}>
            <InputNumber placeholder='请输入排序值' style={{ width: 200 }} />
          </Form.Item>
          <Form.Item<FieldType> label='菜单状态' name='menuState'>
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={2}>停用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MenuForm
