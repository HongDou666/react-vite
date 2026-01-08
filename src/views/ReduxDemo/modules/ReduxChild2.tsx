/* 引入 connect 用于连接 UI组件 与 redux */
import { connect } from 'react-redux'
import type { InputNumberProps } from 'antd'
import { nanoid } from 'nanoid'
import { bindActionCreators } from 'redux'

/* 引入 action */
import { addPerson } from '@/store/actions/person'

interface ParamsType {
  id: string
  name: string
  age: number
}
interface PropsType {
  count: number
  personList: ParamsType[]
  addPerson: (data: ParamsType) => void
}

const ReduxChild2: React.FC<PropsType> = (props) => {
  const { personList, count, addPerson } = props
  const [name, setName] = useState('')
  const [age, setAge] = useState<number | null>()

  const handleAdd = () => {
    const personObj = { id: nanoid(), name, age } as ParamsType
    addPerson(personObj)
    setName('')
    setAge(null)
  }
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleChangeAge: InputNumberProps['onChange'] = (value) => {
    setAge(value as number)
  }

  return (
    <div
      style={{
        border: '5px solid #0065ffbd',
        padding: '10px'
      }}>
      <h2>ReduxChild1 组件求和为 {count}</h2>
      <Input style={{ width: 150 }} placeholder='输入名字' onChange={(e) => handleChangeName(e)} value={name} />
      <InputNumber
        min={1}
        value={age}
        style={{ width: 150, margin: '0 10px' }}
        placeholder='输入年龄'
        onChange={handleChangeAge}
      />
      <Button type='primary' onClick={handleAdd}>
        添加
      </Button>
      <ul>
        {personList.map((item, index) => (
          <li key={item.id}>
            {index + 1} 姓名: <b>{item.name}</b>, 年龄: <b>{item.age}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* 使用 connect()() 创建并暴露一个 ReduxChild2 的容器组件 */
export default connect(
  (state: Record<string, any>) => ({
    count: state.count.value,
    personList: state.persons.personList
  }),

  /* 函数写法1. */
  (dispatch) => ({
    addPerson: (data: ParamsType) => {
      dispatch(addPerson(data))
    }
  })
  /* 函数写法2. */
  // (dispatch) =>
  //   bindActionCreators(
  //     {
  //       addPerson
  //     },
  //     dispatch
  //   )

  /* 对象写法 */
  /* { addPerson } */
)(ReduxChild2)
