import { RefObject } from 'react'

import { postCreateRole, postUpdateRole } from '@/api/role'
import type { IRole } from '@/types/api/role'

interface FieldType {
  roleName: string
  remark: string
  _id: string
}
interface RoleFormPropsType {
  propsRef: RefObject<{ openModal: (type: string, data?: IRole) => void }>
  update: () => void
}

const RoleForm: React.FC<RoleFormPropsType> = (props) => {
  const [form] = Form.useForm()
  const [action, setAction] = useState<string>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useImperativeHandle(props.propsRef, () => ({ openModal }))

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
          // 创建角色
          const param: Parameters<typeof postCreateRole>[0] = validate
          const res: ReturnType<typeof postCreateRole> = postCreateRole(param)
          result = await res
        } else if (action === 'edit') {
          // 编辑角色
          const param: Parameters<typeof postUpdateRole>[0] = form.getFieldsValue() // form.getFieldsValue() 获取表单中收集的数据
          const res: ReturnType<typeof postUpdateRole> = postUpdateRole(param)
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
  const openModal = (type: string, data?: IRole) => {
    setAction(type)
    setIsModalOpen(true)
    if (data) {
      form.setFieldsValue(data)
    }
  }

  return (
    <div>
      <Modal
        title={action === 'create' ? '新增角色' : '编辑角色'}
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
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}>
          <Form.Item<FieldType> hidden name='_id'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='角色名称'
            name='roleName'
            validateTrigger='onBlur'
            rules={[{ required: true, message: '角色名称必填！' }]}>
            <Input placeholder='请输入角色名称' />
          </Form.Item>
          <Form.Item<FieldType> hasFeedback label='备注' name='remark'>
            <Input.TextArea showCount maxLength={200} autoSize={{ minRows: 2, maxRows: 6 }} placeholder='请输入备注' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleForm
