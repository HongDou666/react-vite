import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons'
import { useAntdTable } from 'ahooks'
import type { TableColumnsType } from 'antd'

import { getRoleList, postDeleteRole } from '@/api/role'
import type { IRole, IRoleSearchParams } from '@/types/api/role'
import { formatDateToChinese } from '@/utils'

import RoleForm from './modules/RoleForm'
import SetPermission from './modules/SetPermission'

interface CompRefType {
  openModal: (type: string, data?: IRole) => void
}

const Role: React.FC = () => {
  const [form] = Form.useForm()
  const menuRef = useRef<CompRefType>(null)
  const preRef = useRef<CompRefType>(null)
  const columns: TableColumnsType<IRole> = useMemo(() => {
    return [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
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
              <Tooltip title='设置权限'>
                <Button
                  size='small'
                  shape='circle'
                  color='primary'
                  variant='outlined'
                  icon={<SettingOutlined />}
                  onClick={() => {
                    handleSetPermission(record)
                  }}
                />
              </Tooltip>
              <Tooltip title='删除'>
                <Popconfirm
                  title='确定要删除此角色吗？'
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

  // 获取角色列表
  const getRoleData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: IRoleSearchParams
  ): Promise<{
    list: IRole[]
    total: number | 0
  }> => {
    const params: Parameters<typeof getRoleList>[0] = { ...formData, pageNum: current, pageSize }
    return getRoleList(params)
      .then((res) => {
        if (res.code === 200) {
          return {
            list: res.data?.list || [],
            total: res.data?.page?.total || 0
          }
        } else {
          return { list: [], total: 0 }
        }
      })
      .catch((error) => {
        console.error(error)
        return { list: [], total: 0 }
      })
  }

  const { tableProps, search } = useAntdTable(getRoleData, {
    form, // 绑定 Ant Design Form
    defaultPageSize: 5 // 默认每页显示 5 条数据
  })

  // 新增角色
  const handleCreate = () => {
    menuRef.current?.openModal('create')
  }

  // 编辑角色
  const handleEdit = (record: IRole) => {
    menuRef.current?.openModal('edit', record)
  }

  // 设置权限
  const handleSetPermission = (record: IRole) => {
    preRef.current?.openModal('setPermission', record)
  }

  // 删除角色
  const confirm = (id: string) => {
    return new Promise((resolve) => {
      handleDelOk(id, resolve)
    })
  }

  // 删除角色确认后的操作
  const handleDelOk = async (id: string, resolve) => {
    try {
      const param: Parameters<typeof postDeleteRole>[0] = { _id: id }
      const res: ReturnType<typeof postDeleteRole> = postDeleteRole(param)
      const result = await res
      resolve(null)
      if (result.code === 200) {
        message.success('删除成功！')
        search.submit()
      } else {
        message.error(result.msg || '网络异常！')
      }
    } catch (error: any) {
      resolve(null)
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  return (
    <div>
      <Form className='search-form' layout='inline' form={form}>
        <Form.Item name='roleName' label='角色名称'>
          <Input placeholder='请输入角色名称' />
        </Form.Item>
        <Form.Item>
          <Space wrap>
            <Button htmlType='submit' onClick={search.submit}>
              查询
            </Button>
            <Button htmlType='reset' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='wrap-table'>
        <div className='header'>
          <div className='title'>角色列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table<IRole> bordered rowKey='_id' scroll={{ x: 'max-content' }} columns={columns} {...tableProps} />
      </div>
      {/* 创建角色组件 */}
      <RoleForm propsRef={menuRef} update={search.submit}></RoleForm>
      {/* 设置权限组件 */}
      <SetPermission propsRef={preRef} update={search.submit} />
    </div>
  )
}

export default Role
