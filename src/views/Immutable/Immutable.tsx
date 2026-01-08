/*
  immutable数据一种利用结构共享形成的持久化数据结构，一旦有部分被修改，那么将会返回一个全新的对象，并且原来相同的节点会直接共享

  用一种数据结构来保存数据
  当数据被修改时，会返回一个对象，但是新的对象会尽可能的利用之前的数据结构而不会对内存造成浪费
  也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变，同时为了避免 deepCopy把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享）,如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享
*/

import { fromJS, List, Map } from 'immutable'

const Immutable: React.FC = () => {
  const [person, setPerson] = useState({
    name: '晚风',
    age: 18,
    hobbies: ['学习', '钻研', '咖啡'],
    info: {
      address: '苏州工业园区',
      school: {
        name1: '苏州大学',
        major: {
          name2: '网络工程',
          class: ['虚拟机', '计算机编程', '操作系统']
        }
      }
    }
  })
  const handleClick1 = () => {
    // const newPerson = person
    // const newPerson = Object.assign({}, person)
    const newPerson = { ...person }
    newPerson.name = '张三'
    newPerson.hobbies.push('打游戏') // 影响了 person 的数据
    newPerson.info.school.name1 = '上海交通大学' // 影响了 person 的数据
    newPerson.info.school.major.name2 = '外国语' // 影响了 person 的数据

    setPerson(newPerson)

    /* 常规来说 使用 setPerson 改变数据后 在打印其 person 数据 此时数据应该还是原本数值（异步） 但是其中 hobbies name1 name2 均被改变 原因是因为上面代码用了扩展运算符（浅拷贝导致）  */
    console.log({ person })
    console.log({ newPerson })
  }

  const [data, setData] = useState<Record<string, any>>(
    fromJS({
      name: '秋水',
      age: 20,
      hobbies1: ['Vue', 'React', 'Flutter'],
      info: {
        address: '大连路',
        hobbies2: ['学习', '钻研', '咖啡']
      }
    })
  )
  const handleClick2 = () => {
    const newData = data
      .set('name', '思铭')
      .set('age', data.get('age') + 5)
      .setIn(['hobbies1', 3], '小程序')
      .setIn(['info', 'hobbies1'], '菊花台')
      .updateIn(['info', 'hobbies2'], (list: any) => {
        return [...list, 'C++']
      })

    setData(newData)

    console.log(data.get('name'))
    console.log(data.get('age'))
    console.log(data.get('hobbies1').toJS())
    console.log(data.getIn(['info', 'address']))
    console.log(data.getIn(['info', 'hobbies2']).toJS())
    console.log(data.toJS())
  }

  return (
    <div>
      <Button type='primary' onClick={handleClick1}>
        改变个人信息demo1
      </Button>
      <p>姓名：{person.name}</p>
      <p>年龄：{person.age}</p>
      <p>爱好：{person.hobbies.join(', ')}</p>
      <p>地址：{person.info.address}</p>
      <p>学校：{person.info.school.name1}</p>
      <p>专业：{person.info.school.major.name2}</p>
      <p>课程：{person.info.school.major.class.join(', ')}</p>

      <hr />

      <Button type='primary' onClick={handleClick2}>
        改变个人信息demo2
      </Button>
      <p>姓名：{data.get('name')}</p>
      <p>年龄：{data.get('age')}</p>
      <p>爱好1：{data.get('hobbies1')?.join(' & ')}</p>
      <p>地址：{data.getIn(['info', 'address'])}</p>
      <p>爱好2：{data.getIn(['info', 'hobbies2']).join(' & ')}</p>
    </div>
  )
}

export default Immutable
