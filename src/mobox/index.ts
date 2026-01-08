import Users from './Users'

export interface Stores {
  users: Users
}

const moboxStores: Stores = {
  users: new Users()
}

export default moboxStores
