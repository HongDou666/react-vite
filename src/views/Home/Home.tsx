import { Form, useActionData } from 'react-router-dom'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import FormComp from './modules/FormComp'
import WithRouter from '@/components/WithRouter'

interface ActionDataType {
  success: boolean
  message: string
  data: Record<string, any>
}

const Home = (props) => {
  const actionData = useActionData() as ActionDataType
  const handleClick = () => {
    window.toShow({
      title: 'Hello World!',
      type: 'success',
      duration: 3
    })
  }

  return (
    <div className='flex-col gap-20px'>
      <Space>
        <Button type='primary' onClick={handleClick}>
          弹出消息 Hello World!
        </Button>
      </Space>

      <Space>
        {/* 显示 Action 返回的信息 */}
        {actionData && actionData?.success && <Alert message='登录成功' type='success' />}

        <div>
          <Form method='post' action='/home'>
            <div>
              <label htmlFor='userName'>
                <Space>
                  <Button style={{ pointerEvents: 'none' }}>账号:</Button>
                  <Input id='userName' name='userName' placeholder='请输入账号' prefix={<UserOutlined />} />
                </Space>
              </label>
            </div>
            <div>
              <label htmlFor='passWord'>
                <Space>
                  <Button style={{ pointerEvents: 'none' }}>密码:</Button>
                  <Input.Password id='passWord' name='passWord' placeholder='请输入密码' prefix={<GithubOutlined />} />
                </Space>
              </label>
            </div>
            <button type='submit'>登录系统</button>
          </Form>
        </div>
      </Space>

      <Space>
        <FormComp />
      </Space>
    </div>
  )
}

export default WithRouter(Home)
