interface PropsType {
  value?: string[]
  onChange?: (...args: any[]) => void
}

// 模拟设备选项
const equipmentOptions = [
  { label: '设备A', value: '1' },
  { label: '设备B', value: '2' },
  { label: '设备C', value: '3' }
]

const FormComp: React.FC<PropsType> = ({ value, onChange }) => {
  const handleClick = () => {
    // 更改选中设备
    onChange && onChange(['3'])
  }

  return (
    <div>
      <Button type='primary' onClick={handleClick}>
        自动选中 设备C
      </Button>
      <Select
        mode='multiple' // 支持多选
        value={value} // 接收表单值（由 Form.Item 自动注入）
        onChange={onChange} // 将变化传回表单
        options={equipmentOptions}
        placeholder='请选择设备'
      />
    </div>
  )
}

export default FormComp
