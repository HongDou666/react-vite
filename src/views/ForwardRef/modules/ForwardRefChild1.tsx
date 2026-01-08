import { forwardRef } from 'react'

function ForwardRefChild1(props, ref) {
  const { handleChange, ...otherProps } = props

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.value)
  }

  console.log('ForwardRefChild1 - 渲染')

  return (
    <div>
      <Input {...otherProps} onChange={handleChangeValue} ref={ref} />
    </div>
  )
}

export default memo(forwardRef(ForwardRefChild1))
