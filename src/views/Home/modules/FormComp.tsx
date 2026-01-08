import { Button, Form, Input, Select } from 'antd'
import CustomItem from './CustomItem'

const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
}

const FormComp: React.FC = () => {
  const [form] = Form.useForm()

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' })
        return
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' })
        return
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' })
    }
  }

  const onFinish = (values: any) => {
    console.log(values)
  }

  const onReset = () => {
    form.resetFields()
  }

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
      equipmentOneIds: ['1', '2', '3']
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      equipmentOneIds: ['1', '3'] // 默认选中设备A和设备C
    })
  }, [])

  return (
    <Form {...layout} form={form} name='control-hooks' onFinish={onFinish} style={{ width: '500px' }}>
      <Form.Item name='note' label='Note' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='gender' label='Gender' rules={[{ required: true }]}>
        <Select placeholder='Select a option and change input text above' onChange={onGenderChange} allowClear>
          <Option value='male'>male</Option>
          <Option value='female'>female</Option>
          <Option value='other'>other</Option>
        </Select>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}>
        {({ getFieldValue }) =>
          getFieldValue('gender') === 'other' ? (
            <Form.Item name='customizeGender' label='Customize' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item>

      <Form.Item
        name='equipmentOneIds'
        label='选择设备'
        trigger='onChange'
        rules={[{ required: true, message: '请至少选择一个设备！' }]}>
        {/* 无需手动传递 value / onChange，Form.Item 会自动处理 */}
        <CustomItem />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
        <Button htmlType='button' onClick={onReset}>
          Reset
        </Button>
        <Button type='link' htmlType='button' onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormComp
