import { LockOutlined, UserOutlined } from '@ant-design/icons'
import type { FormProps } from 'antd'
import { message, Typography } from 'antd'

import { postLogin } from '@/api/login'
import SvgIcon from '@/components/VitePluginSvgr'
import { pageBubble } from '@/plugins'
import { router } from '@/routes'
import { useRoute } from '@/routes/hooks/use-route'
import { regularPassword, useAuthorization } from '@/utils'

import ParticleBackground from './components/ParticleBackground'

import moduleScss from './index.module.scss'

type FieldType = {
  hiddenField?: string
  username: string
  password: string
  remember: boolean
}

const Login: React.FC = () => {
  const route = useRoute() // 获取当前路由路径
  const navigate = useNavigate()
  const [_, setToken_] = useAuthorization()
  const [getToken, setToken, removeToken] = useAuthorization('login')
  const loginParams = getToken() || {}
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm<FieldType>()
  const initialValues = useRef<FieldType>({
    username: '',
    password: '',
    remember: false,
    ...loginParams
    // ...JSON.parse(getToken() || '{}')
  })
  const bubbleCanvas = useRef<HTMLCanvasElement>(null)
  const username = Form.useWatch((values) => `当前用户名: ${values.username || ''}`, form)

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    if (values.remember) {
      setToken(values)
    } else {
      removeToken()
    }
    try {
      setLoading(true)
      const param: Parameters<typeof postLogin>[0] = { ...values }
      const res: ReturnType<typeof postLogin> = postLogin(param)
      const result = await res
      setLoading(false)
      if (result.code === 200) {
        message.success('登录成功！')
        setToken_(result.data)
        /* 1. 登录成功后跳转到首页 */
        // router.navigate('/')

        /* 2. 登录成功后跳转到首页 */
        if (route.query.redirect) {
          navigate(route.query.redirect, { replace: false })
        } else {
          navigate(`/`, { replace: false })
        }
      } else {
        message.error(result.msg || '登录失败！')
      }
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  const handleToAdmin = () => {
    const data = { username: 'admin', password: 'Sidec#456', remember: true }
    form.setFieldsValue(data) // 填充表单数据
    onFinish(data)
  }

  const checkPassword = (_: any, value: string) => {
    if (!value.trim()) {
      return Promise.reject(new Error('请输入密码！'))
    }
    if (value.trim().length < 8) {
      return Promise.reject(new Error('密码长度不能小于8位'))
    }
    if (!regularPassword(value)) {
      return Promise.reject(new Error('必须包含数字、大小写字母、特殊字符'))
    }
    return Promise.resolve()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      pageBubble.init(bubbleCanvas.current!)
    }, 300)
    return () => {
      clearTimeout(timer)
      pageBubble.removeListeners()
    }
  }, [])

  return (
    <div className={moduleScss['login-wrap']}>
      {/* 原生 JS Canvas 背景 */}
      <ParticleBackground />

      <div className='login-container'>
        <div className='canvas-canvas'>
          <canvas ref={bubbleCanvas} />
        </div>
        <div className='logo-container'>
          <SvgIcon fullPath='loading' width={50} fill='#646cff'></SvgIcon>
          <h1>晚风 管理系统</h1>
        </div>
        <Form
          name='login'
          autoComplete='off'
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={initialValues.current}
          onFinish={onFinish}>
          {/* hidden 是否隐藏字段（依然会收集和校验字段）用于表单提交时携带但不显示在界面上 */}
          <Form.Item<FieldType> hidden name='hiddenField'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='用户名'>
            <Space>
              <Form.Item
                hasFeedback
                noStyle
                name='username'
                validateTrigger='onBlur'
                rules={[{ required: true, message: '请输入用户名！' }]}>
                <Input prefix={<UserOutlined />} placeholder='用户名' />
              </Form.Item>
              <Tooltip title={username}>
                <Typography.Link href='https://gitee.com/moliwq' target='_blank'>
                  Need Help
                </Typography.Link>
              </Tooltip>
            </Space>
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label='密码'
            name='password'
            validateTrigger='onBlur'
            validateDebounce={300}
            rules={[
              {
                required: true,
                validator: checkPassword
              }
            ]}>
            <Input.Password prefix={<LockOutlined />} type='password' placeholder='密码' />
          </Form.Item>
          <Form.Item<FieldType> label={null} wrapperCol={{ span: 24 }}>
            <Flex justify='space-between' align='center'>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href=''>忘记密码?</a>
            </Flex>
          </Form.Item>
          <Form.Item label={null} wrapperCol={{ offset: 0, span: 24 }}>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type='primary' htmlType='submit' loading={loading}>
                登录
              </Button>
              <Button htmlType='button' onClick={() => form.resetFields()}>
                重置
              </Button>
              <Button htmlType='button' onClick={handleToAdmin}>
                超级管理员
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
