import { Input } from 'antd'

const KeepAliveDemo3: React.FC = () => {
  const params = useParams()
  const [value, setValue] = useState('')

  return (
    <>
      <div className='h-600px overflow-y-auto bg-#d3346942'>
        <div className='text-20px c-#ff8f57'>{params.id}</div>
        <div className='pos-relative h-100vh'>
          <Input
            className='pos-absolute top-40% h34px'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='带有缓存功能'
          />
        </div>
      </div>
    </>
  )
}

export default KeepAliveDemo3
