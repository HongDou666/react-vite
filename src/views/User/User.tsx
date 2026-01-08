import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'

import { getUserList, postDelUser } from '@/api/user'
import type { IUser } from '@/types/api/user'
import { formatDateToChinese } from '@/utils'

import SearchForm from './modules/SearchForm'
import UserForm from './modules/UserForm'

interface CompRefType {
  openModal: (type: string, data?: IUser) => void
}

const User: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userIds, setUserIds] = useState<number[]>([])
  const [data, setData] = useState<IUser[]>([])
  const userRef = useRef<CompRefType>(null)
  const pagination = useRef({
    defaultCurrent: 1,
    defaultPageSize: 5,
    current: 1,
    pageSize: 5,
    total: 0,
    simple: false,
    responsive: false,
    showSizeChanger: true,
    showQuickJumper: true,
    hideOnSinglePage: false,
    pageSizeOptions: ['5', '10', '30'],
    showTotal: (total) => `共 ${total} 条数据`,
    onChange: (page, pageSize) => {
      pagination.current.current = page
      if (pagination.current.pageSize !== pageSize) {
        Object.assign(pagination.current, { current: 1, pageSize })
      }
      getUserList_()
    }
  })
  const columns: TableColumnsType<IUser> = useMemo(() => {
    return [
      {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: '用户名称',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '用户邮箱',
        dataIndex: 'userEmail',
        key: 'userEmail'
      },
      {
        title: '用户用户',
        dataIndex: 'role',
        key: 'role',
        render(role: number) {
          return { 0: '超级管理员', 1: '管理员', 2: '体验管理员', 3: '普通用户' }[role]
        }
      },
      {
        title: '用户状态',
        dataIndex: 'state',
        key: 'state',
        render(state: number) {
          return { 1: '在职', 2: '离职', 3: '试用期' }[state]
        }
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (createTime: string) => formatDateToChinese(createTime)
      },
      {
        title: '操作',
        key: 'action',
        width: '200',
        render: (_, record) => {
          return (
            <Space>
              <Tooltip title='编辑'>
                <Button
                  size='small'
                  type='primary'
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => {
                    handleEdit(record)
                  }}
                />
              </Tooltip>
              <Tooltip title='删除'>
                <Popconfirm
                  title='确定要删除此用户吗？'
                  okText='确定'
                  cancelText='取消'
                  onConfirm={() => confirm(record.userId)}>
                  <Button danger size='small' shape='circle' icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          )
        }
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getUserList_()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取用户列表
  const getUserList_ = async () => {
    try {
      setLoading(true)
      const params: Parameters<typeof getUserList>[0] = {
        ...form.getFieldsValue(),
        pageNum: pagination.current.current,
        pageSize: pagination.current.pageSize
      }
      const res: ReturnType<typeof getUserList> = getUserList(params)
      const result = await res
      setLoading(false)
      if (result.code === 200) {
        setData(result.data?.list || [])
      } else {
        setData([])
        message.error(result.msg || '网络异常！')
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  // 新增用户
  const handleCreate = () => {
    userRef.current?.openModal('create')
  }

  // 编辑用户
  const handleEdit = (record: IUser) => {
    userRef.current?.openModal('edit', record)
  }

  // 删除用户
  const confirm = (id: number) => {
    return new Promise((resolve) => {
      handleDelOk([id], resolve)
    })
  }

  // 批量删除用户
  const handlePatchConfirm = () => {
    if (!userIds.length) {
      message.warning('请选择要删除的用户')
      return
    }
    Modal.confirm({
      title: '删除确认',
      content: <span>确认删除该批用户吗？</span>,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        handleDelOk(userIds)
      }
    })
  }

  // 删除用户确认后的操作
  const handleDelOk = async (ids: number[], resolve?) => {
    try {
      const param: Parameters<typeof postDelUser>[0] = { userIds: ids }
      const res: ReturnType<typeof postDelUser> = postDelUser(param)
      const result = await res
      resolve && resolve(null)
      if (result.code === 200) {
        message.success('删除成功！')
        pagination.current.current = 1
        setUserIds([])
        getUserList_()
      } else {
        message.error(result.msg || '网络异常！')
      }
    } catch (error: any) {
      resolve && resolve(null)
      console.error(error)
    }
  }

  // 查询用户列表
  const handleSearch = () => {
    getUserList_()
  }

  // 重置用户列表
  const handleReset = () => {
    form.resetFields()
    getUserList_()
  }

  return (
    <>
      <SearchForm
        className='search-form'
        layout='inline'
        form={form}
        initialValues={{ state: 1 }}
        submit={handleSearch}
        reset={handleReset}>
        <Form.Item name='userId' label='用户ID'>
          <Input style={{ width: 140 }} placeholder='请输入用户ID' />
        </Form.Item>
        <Form.Item name='userName' label='用户名称'>
          <Input style={{ width: 140 }} placeholder='请输入用户名称' />
        </Form.Item>
        <Form.Item name='state' label='状态'>
          <Select style={{ width: 140 }}>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>

      <div className='wrap-table'>
        <div className='header'>
          <div className='title'>用户列表</div>
          <div className='action'>
            <AuthButton auth='user@create' type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
              新增
            </AuthButton>
            <AuthButton auth='dept@delete' danger icon={<DeleteOutlined />} onClick={handlePatchConfirm}>
              批量删除
            </AuthButton>

            {/* <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
              新增
            </Button>
            dept@delete
            <Button danger icon={<DeleteOutlined />} onClick={handlePatchConfirm}>
              批量删除
            </Button> */}
          </div>
        </div>

        <Table<IUser>
          bordered
          rowKey='userId'
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={pagination.current}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[])
            }
          }}
        />
      </div>
      {/* 创建用户组件 */}
      <UserForm propsRef={userRef} update={getUserList_}></UserForm>
    </>
  )
}

export default User
