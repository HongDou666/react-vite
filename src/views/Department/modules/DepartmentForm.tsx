import { RefObject } from 'react'

import { getDeptList, postCreateDept, postUpdateDept } from '@/api/department'
import { getAllUserList } from '@/api/user'
import type { IDept } from '@/types/api/department'
import type { IUser } from '@/types/api/user'

interface FieldType {
  deptName: string
  userName: string | null
  parentId: string | null
  _id: string
}
interface DepartmentFormPropsType {
  propsRef: RefObject<{ openModal: (type: string, data?: IDept | { parentId: string }) => void }>
  update: () => void
}

const DepartmentForm: React.FC<DepartmentFormPropsType> = (props) => {
  const [form] = Form.useForm()
  const [action, setAction] = useState<string>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [deptList, setDeptList] = useState<IDept[]>()
  const [userList, setUserList] = useState<IUser[]>()

  useEffect(() => {
    getAllUserList_()
  }, [])
  useImperativeHandle(props.propsRef, () => ({ openModal }))

  // 获取部门列表
  const getDeptList_ = async () => {
    try {
      const res: ReturnType<typeof getDeptList> = getDeptList()
      const result = await res
      if (result.code === 200) {
        setDeptList(result.data!)
      } else {
        setDeptList([])
      }
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  // 获取所有用户信息
  const getAllUserList_ = async () => {
    try {
      const res: ReturnType<typeof getAllUserList> = getAllUserList()
      const result = await res
      if (result.code === 200) {
        setUserList(result.data!)
      } else {
        setUserList([])
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
          const param: Parameters<typeof postCreateDept>[0] = validate
          const res: ReturnType<typeof postCreateDept> = postCreateDept(param)
          result = await res
        } else if (action === 'edit') {
          // 编辑部门
          const param: Parameters<typeof postUpdateDept>[0] = form.getFieldsValue() // form.getFieldsValue() 获取表单中收集的数据
          const res: ReturnType<typeof postUpdateDept> = postUpdateDept(param)
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
  const openModal = (type: string, data?: IDept | { parentId: string }) => {
    setAction(type)
    getDeptList_()
    setIsModalOpen(true)
    if (data) {
      form.setFieldsValue(data)
    }
  }

  return (
    <div>
      <Modal
        title={action === 'create' ? '添加部门' : '编辑部门'}
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
          wrapperCol={{ span: 19 }}>
          <Form.Item<FieldType> hidden name='_id'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='上级部门'
            name='parentId'
            validateTrigger='onChange'
            rules={[{ required: true, message: '上级部门必填！' }]}>
            <TreeSelect
              allowClear
              placeholder='请选择上级部门'
              treeDefaultExpandAll
              treeData={deptList}
              fieldNames={{ label: 'deptName', value: '_id' }}></TreeSelect>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='部门名称'
            name='deptName'
            validateTrigger='onBlur'
            rules={[{ required: true, message: '部门名称必填！' }]}>
            <Input placeholder='请输入部门名称' />
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='负责人'
            name='userName'
            validateTrigger='onChange'
            rules={[{ required: true, message: '负责人必填！' }]}>
            <Select placeholder='请选择负责人'>
              {userList?.map((item) => (
                <Select.Option key={item._id} value={item.userName}>
                  {item.userName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DepartmentForm
