interface InfoType {
  name: string
  age: number
  sex: string
  info: {
    address: string
    phone: string
    interests: {
      music: string[]
      film: string[]
    }
  }
}
interface PropsType {
  count: number
  falg?: boolean
  nodeData?: InfoType
  handleClick: (value: number) => void
  style?: React.CSSProperties
  children?: React.ReactNode
}

const defaultCallback = (num: number): string => {
  return `The number is ${num}`
}

const FuncCompChild1: React.FC<PropsType> = ({
  count = 100,
  falg = false,
  nodeData = {
    name: '红豆',
    age: 20,
    sex: '女',
    info: {
      address: '苏州',
      phone: '415800000',
      interests: {
        music: ['古风'],
        film: ['动作']
      }
    }
  },
  handleClick = defaultCallback
}: PropsType) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px'
      }}>
      <div>count: {count}</div>
      <div>falg: {falg ? 'true' : 'false'}</div>
      <p>name: {nodeData.name}</p>
      <p>age: {nodeData.age}</p>
      <p>sex: {nodeData.sex}</p>
      <p>城市: {nodeData.info.address}</p>
      <Button type='primary' onClick={() => handleClick(2)}>
        信息通信
      </Button>
    </div>
  )
}

export default FuncCompChild1
