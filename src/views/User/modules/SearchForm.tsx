import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'

interface SearchFormType {
  form: any
  className: string
  layout: 'inline' | 'vertical'
  initialValues: { state: number }
  submit: () => void
  reset: () => void
  children: React.ReactNode
}

const SearchForm: React.FC<SearchFormType> = ({ form, className, layout, initialValues, submit, reset, children }) => {
  return (
    <Form className={className} form={form} initialValues={initialValues} layout={layout}>
      {children && children}
      <Form.Item>
        <Space wrap size={15}>
          <Button
            type='primary'
            htmlType='submit'
            size='small'
            shape='circle'
            icon={<SearchOutlined />}
            onClick={submit}
          />
          <Button
            htmlType='button'
            size='small'
            shape='circle'
            color='primary'
            variant='outlined'
            icon={<ReloadOutlined />}
            onClick={reset}
          />
        </Space>
      </Form.Item>
    </Form>
  )
}

export default SearchForm
