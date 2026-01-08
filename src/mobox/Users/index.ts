import { configure, makeAutoObservable, runInAction } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

import { getMaizuo } from '@/api/mock/index'

configure({
  /*
    observed 可观察状态必须通过 action 修改
    never 可观察状态在任何地方修改
  */
  enforceActions: 'observed'
})
class Users {
  price = 3
  amount = 6
  listData: any[] = []
  infoCars = {
    name: '汽车4s店',
    shop: {
      list: [
        {
          name: '奔驰',
          price: 100
        },
        {
          name: '宝马',
          price: 200
        },
        {
          name: '奥迪',
          price: 300
        }
      ]
    }
  }

  constructor() {
    /* 通过 makeAutoObservable 自动地给类中的每个属性和方法标记上 observale 和 action */
    makeAutoObservable(this)

    /* 数据持久化配置 */
    makePersistable(this, {
      name: 'users',
      properties: ['price', 'amount', 'listData'],
      storage: window.localStorage
    })
  }

  increaseAmount() {
    this.amount += 1
  }
  increaseCar(item) {
    this.infoCars.shop.list.push(item)
  }
  async addListData(data) {
    const { node, config } = data
    try {
      const param: Parameters<typeof getMaizuo>[0] = node
      const res: ReturnType<typeof getMaizuo> = getMaizuo(param, config)
      const result = await res
      runInAction(() => {
        this.listData = result.data?.films || []
      })
    } catch (error: any) {
      console.error(error) // 只是在控制台打印一条红色消息，并不影响程序的运行
    }
  }

  /* 使用 get set 的方法，会被自动标记为 computed */
  get getCarsList() {
    return this.infoCars.shop.list
  }
  get total() {
    return this.price * this.amount
  }
  set total(value: number) {
    this.price = value || 0
  }
}

export default Users
