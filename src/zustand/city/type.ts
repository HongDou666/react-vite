type CitysType = {
  name: string
}

export interface CityType {
  citys: CitysType[]
  deep: {
    nested: {
      obj: {
        count: number
      }
    }
  }
  addCitys: (value: CitysType) => void
  reset: () => void
}
