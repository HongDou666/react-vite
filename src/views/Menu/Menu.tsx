import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'

import { getMenuList, postDeleteMenu } from '@/api/menu'
import { IMenu } from '@/types/api/menu'
import { formatDateToChinese } from '@/utils'

import MenuForm from './modules/MenuForm'

interface MenuRefType {
  openModal: (type: string, data?: IMenu | { parentId: string }) => void
}

const Menu: React.FC = () => {
  const [form] = Form.useForm()
  const menuRef = useRef<MenuRefType>(null)
  const [data, setData] = useState<IMenu[]>([])
  const [loading, setLoading] = useState(false)
  const columns: TableColumnsType<IMenu> = useMemo(() => {
    return [
      {
        title: '菜单名称',
        dataIndex: 'menuName',
        key: 'menuName',
        width: '200'
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        key: 'icon'
      },
      {
        title: '菜单类型',
        dataIndex: 'menuType',
        key: 'menuType',
        render: (text: number) => {
          return { 1: '菜单', 2: '按钮', 3: '页面' }[text]
        }
      },
      {
        title: '权限标识',
        dataIndex: 'menuCode',
        key: 'menuCode'
      },
      {
        title: '路由地址',
        dataIndex: 'path',
        key: 'path'
      },
      {
        title: '组件名称',
        dataIndex: 'component',
        key: 'component'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
                  title='确定要删除此菜单吗？'
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
    getMenuList_()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取菜单列表
  const getMenuList_ = async () => {
    try {
      setLoading(true)
      const param: Parameters<typeof getMenuList>[0] = form.getFieldsValue()
      const res: ReturnType<typeof getMenuList> = getMenuList(param)
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

  // 新增菜单
  const handleCreate = () => {
    menuRef.current?.openModal('create')
  }

  // 查询菜单列表
  const getMenuData = async () => {
    getMenuList_()
  }

  // 重置菜单列表
  const handleReset = async () => {
    form.resetFields() // 重置表单字段的值
    getMenuList_()
  }

  // 新增子菜单
  const handleSubCreate = (id: string) => {
    menuRef.current?.openModal('create', { parentId: id })
  }

  // 编辑菜单
  const handleEdit = (record: IMenu) => {
    menuRef.current?.openModal('edit', record)
  }

  // 删除菜单
  const confirm = (id: string) => {
    Modal.confirm({
      title: '删除菜单',
      content: '确定删除该菜单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        handleDelOk(id)
      }
    })
  }

  // 删除菜单确认后的操作
  const handleDelOk = async (id: string) => {
    try {
      const param: Parameters<typeof postDeleteMenu>[0] = { _id: id }
      const res: ReturnType<typeof postDeleteMenu> = postDeleteMenu(param)
      const result = await res
      if (result.code === 200) {
        message.success('删除成功！')
        getMenuList_()
      } else {
        message.error(result.msg || '网络异常！')
      }
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  return (
    <div>
      <Form className='search-form' layout='inline' form={form} initialValues={{ menuState: 1 }}>
        <Form.Item name='menuName' label='菜单名称'>
          <Input placeholder='请输入菜单名称' />
        </Form.Item>
        <Form.Item name='menuState' label='菜单状态'>
          <Select placeholder='请选择菜单状态' style={{ width: 180 }}>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={2}>禁用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space wrap>
            <Button onClick={getMenuData}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='wrap-table'>
        <div className='header'>
          <div className='title'>菜单列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table<IMenu>
          rowKey='_id'
          bordered
          scroll={{ x: 'max-content' }}
          pagination={false}
          loading={loading}
          columns={columns}
          dataSource={data}
        />
      </div>
      <MenuForm propsRef={menuRef} update={getMenuList_}></MenuForm>
    </div>
  )
}

export default Menu
