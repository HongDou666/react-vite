import { RefObject } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { Image, Upload } from 'antd'

import { getDeptList } from '@/api/department'
import { getAllRoleList } from '@/api/role'
import { postCreateUser, postEditUser } from '@/api/user'
import { IDept } from '@/types/api/department'
import { IRole } from '@/types/api/role'
import type { IUser } from '@/types/api/user'
import { useAuthorization } from '@/utils'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
interface FieldType {
  _id: string
  userName: string
  userEmail: string
  mobile: string
  deptId: string
  job: string
  state: number
  roleList: string
  userImg: string
}
interface UserFormPropsType {
  propsRef: RefObject<{ openModal: (type: string, data?: IUser) => void }>
  update: () => void
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const UserForm: React.FC<UserFormPropsType> = (props) => {
  const [getToken] = useAuthorization()
  const [form] = Form.useForm()
  const [action, setAction] = useState<string>('create')
  const [deptList, setDeptList] = useState<IDept[]>([])
  const [roleList, setRoleList] = useState<IRole[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([
    /*
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      }
    */
  ])

  useImperativeHandle(props.propsRef, () => ({ openModal }))

  useEffect(() => {
    getDeptList_()
    getRoleList_()
  }, [])

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
      console.error(error)
    }
  }

  // 获取所有角色列表
  const getRoleList_ = async () => {
    try {
      const res: ReturnType<typeof getAllRoleList> = getAllRoleList()
      const result = await res
      if (result.code === 200) {
        setRoleList(result.data!)
      } else {
        setRoleList([])
      }
    } catch (error: any) {
      console.error(error)
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
          // 创建用户
          const params: Parameters<typeof postCreateUser>[0] = {
            ...form.getFieldsValue(),
            userImg: imgUrl
          }
          const res: ReturnType<typeof postCreateUser> = postCreateUser(params)
          result = await res
        } else if (action === 'edit') {
          // 编辑用户
          const param: Parameters<typeof postEditUser>[0] = {
            ...form.getFieldsValue(),
            userImg: imgUrl
          }
          const res: ReturnType<typeof postEditUser> = postEditUser(param)
          result = await res
        }
        setConfirmLoading(false)
        if (result.code === 200) {
          message.success(action === 'create' ? '创建成功' : '修改成功！')
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

  // 关闭弹窗 & 重置表单数据
  const handleCancel = () => {
    setIsModalOpen(false)
    setFileList([])
    setImgUrl('')
    form.resetFields()
  }

  // 打开弹窗 & 获取部门列表
  const openModal = (type: string, data?: IUser) => {
    setAction(type)
    setIsModalOpen(true)
    if (type === 'edit' && data) {
      form.setFieldsValue(data)
      data.userImg && setImgUrl(data.userImg)
      data.userImg &&
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: data.userImg
          }
        ])
    }
  }

  /*
    beforeUpload	上传文件之前的钩子
    1. 非图片格式的文件｜文件大小超过0.5MB 不会发送网络请求
    2. beforeUpload 返回 false 或 Promise.reject 时，只用于拦截上传行为，不会阻止文件进入上传列表（原因）。如果需要阻止列表展现，可以通过返回 Upload.LIST_IGNORE 实现
  */
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 png 或 jpeg 格式的图片')
    }
    const limit500 = file.size / 1024 / 1024 < 0.5
    if (!limit500) {
      message.error('图片不能超过500KB')
    }
    return (isJpgOrPng && limit500) || Upload.LIST_IGNORE
  }

  /* 上传文件改变时的回调，上传每个阶段都会触发该事件 */
  const handleChange: UploadProps['onChange'] = ({ file, fileList }: { file: UploadFile; fileList: UploadFile[] }) => {
    setFileList(fileList)
    if (file.status === 'uploading') {
      setUploadLoading(true)
      return
    }
    if (file.status === 'done') {
      setUploadLoading(false)
      const { code, data, msg } = file.response
      if (code === 0) {
        setImgUrl(data.file) // 设置后端接口成功后返回的图片地址
      } else {
        msg && message.error(msg)
      }
    } else if (file.status === 'error') {
      setUploadLoading(false)
      message.error('服务器异常，请稍后重试')
    }
  }

  /* 预览图片处理 */
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj as FileType)) as string
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  /* 上传文件的icon */
  const uploadButton = useMemo(() => {
    return (
      <button style={{ border: 0, background: 'none' }} type='button'>
        {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传图片</div>
      </button>
    )
  }, [uploadLoading])

  return (
    <div>
      <Modal
        title={action === 'create' ? '创建用户' : '编辑用户'}
        okText='确定'
        cancelText='取消'
        width={800}
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
            label='用户名称'
            name='userName'
            validateTrigger='onBlur'
            rules={[
              { required: true, message: '用户名称必填！' },
              { min: 5, max: 12, message: '用户名称最小5个字符，最大12个字符' }
            ]}>
            <Input placeholder='请输入用户名称'></Input>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='用户邮箱'
            name='userEmail'
            validateTrigger='onBlur'
            rules={[
              { required: true, message: '用户邮箱必填！' },
              { type: 'email', message: '请输入正确的邮箱格式' },
              {
                pattern: /^\w+@gmail.com$/,
                message: '邮箱必须以@gmail.com结尾'
              }
            ]}>
            <Input placeholder='请输入用户邮箱' disabled={action === 'edit'}></Input>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='手机号'
            name='mobile'
            validateTrigger='onBlur'
            rules={[
              { len: 11, message: '请输入11位手机号' },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '请输入1开头的11位手机号'
              }
            ]}>
            <Input type='number' placeholder='请输入手机号'></Input>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='部门'
            name='deptId'
            validateTrigger='onChange'
            rules={[{ required: true, message: '部门必填！' }]}>
            <TreeSelect
              allowClear
              placeholder='请选择部门'
              treeDefaultExpandAll
              /*
                TreeSelect.SHOW_ALL: 显示所有选中节点(包括父节点)
                TreeSelect.SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时)。 默认只显示子节点
              */
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              fieldNames={{ label: 'deptName', value: '_id' }}
              treeData={deptList}
            />
          </Form.Item>
          <Form.Item<FieldType> hasFeedback label='岗位' name='job'>
            <Input placeholder='请输入岗位'></Input>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='状态'
            name='state'
            validateTrigger='onChange'
            rules={[{ required: true, message: '状态必填！' }]}>
            <Select
              showSearch
              optionFilterProp='label'
              placeholder='请选择状态'
              fieldNames={{ label: 'label', value: 'value' }}
              options={[
                { value: 1, label: '在职', title: '在职' },
                { value: 2, label: '离职', title: '离职' },
                { value: 3, label: '试用期', title: '试用期' }
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='系统角色'
            name='roleList'
            validateTrigger='onChange'
            rules={[{ required: true, message: '系统角色必填！' }]}>
            <Select showSearch optionFilterProp='label' placeholder='请选择系统角色'>
              {roleList.map((item) => (
                <Select.Option label={item.roleName} title={item.roleName} value={item._id} key={item._id}>
                  {item.roleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            hasFeedback
            label='用户头像'
            name='userImg'
            validateTrigger='onChange'
            rules={[{ required: true, message: '用户头像必填！' }]}>
            <div>
              <Upload
                name='avatar' // 上传的文件字段名
                className='avatar-uploader' // 上传按钮样式
                listType='picture-card' // 上传列表的内建样式
                multiple={false} // 是否支持多选文件
                showUploadList={true} // 是否展示文件列表
                maxCount={2} // 同时上传的最大文件数(文件列表最多只展示两个文件)
                action='/api/users/upload' // 上传的地址
                accept='image/jpeg,image/png,image/gif,image/bmp,image/svg+xml' // 接受上传的文件类型
                headers={{ 'Authorization-Token': getToken()! }} // 上传的请求头token
                data={{ eventType: 'file_upload' }}
                fileList={fileList} // 展示的文件列表
                beforeUpload={beforeUpload} // 上传前的钩子，参数为上传的文件，若返回 false 则停止上传
                onChange={handleChange} // 上传文件改变时的状态
                onPreview={handlePreview} // 点击文件链接或预览图标时的回调
              >
                {/* 上传图片大于等于2张隐藏上传按钮 */}
                {fileList.length >= 2 ? null : uploadButton}
              </Upload>

              {/* 图片预览 */}
              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage('')
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserForm
