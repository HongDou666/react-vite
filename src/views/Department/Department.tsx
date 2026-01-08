import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'

import { getDeptList, postDeleteDept } from '@/api/department'
import { IDept } from '@/types/api/department'
import { formatDateToChinese } from '@/utils'

import DepartmentForm from './modules/DepartmentForm'

interface DeptRefType {
  openModal: (type: string, data?: IDept | { parentId: string }) => void
}

const Department: React.FC = () => {
  const [form] = Form.useForm()
  const deptRef = useRef<DeptRefType>(null)
  const [data, setData] = useState<IDept[]>([])
  const [loading, setLoading] = useState(false)
  const columns: TableColumnsType<IDept> = useMemo(() => {
    return [
      {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName',
        width: '200'
      },
      {
        title: '负责人',
        dataIndex: 'userName',
        key: 'userName',
        width: '150'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => formatDateToChinese(text)
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text) => formatDateToChinese(text)
      },
      {
        title: '操作',
        key: 'action',
        width: '200',
        render: (_, record) => {
          return (
            <Space>
              <Tooltip title='新增'>
                <Button
                  size='small'
                  type='primary'
                  shape='circle'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    handleSubCreate(record._id)
                  }}
                />
              </Tooltip>
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
                  title='确定要删除此部门吗？'
                  okText='确定'
                  cancelText='取消'
                  onConfirm={() => confirm(record._id)}>
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
    getDeptList_()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取部门列表
  const getDeptList_ = async () => {
    try {
      setLoading(true)
      const param: Parameters<typeof getDeptList>[0] = form.getFieldsValue()
      const res: ReturnType<typeof getDeptList> = getDeptList(param)
      const result = await res
      setLoading(false)
      if (result.code === 200) {
        setData(result.data!)
      } else {
        setData([])
        message.error(result.msg || '网络异常！')
      }
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  // 新增部门
  const handleCreate = () => {
    deptRef.current?.openModal('create')
  }

  // 查询部门列表
  const getDepthData = async () => {
    getDeptList_()
  }

  // 重置部门列表
  const handleReset = async () => {
    form.resetFields() // 重置表单字段的值
    getDeptList_()
  }

  // 新增子部门
  const handleSubCreate = (id: string) => {
    deptRef.current?.openModal('create', { parentId: id })
  }

  // 编辑部门
  const handleEdit = (record: IDept) => {
    deptRef.current?.openModal('edit', record)
  }

  // 删除部门
  const confirm = (id: string) => {
    Modal.confirm({
      title: '删除部门',
      content: '确定删除该部门吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        handleDelOk(id)
      }
    })
  }

  // 删除部门确认后的操作
  const handleDelOk = async (id: string) => {
    try {
      const param: Parameters<typeof postDeleteDept>[0] = { _id: id }
      const res: ReturnType<typeof postDeleteDept> = postDeleteDept(param)
      const result = await res
      if (result.code === 200) {
        message.success('删除成功！')
        getDeptList_()
      } else {
        message.error(result.msg || '网络异常！')
      }
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  return (
    <div>
      <Form className='search-form' layout='inline' form={form} initialValues={{ deptName: '' }}>
        <Form.Item name='deptName' label='部门名称'>
          <Input placeholder='请输入部门名称' />
        </Form.Item>
        <Form.Item>
          <Space wrap>
            <Button onClick={getDepthData}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='wrap-table'>
        <div className='header'>
          <div className='title'>部门列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table<IDept>
          rowKey='_id'
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={data}
        />
      </div>
      <DepartmentForm propsRef={deptRef} update={getDeptList_}></DepartmentForm>
    </div>
  )
}

export default Department
