const task: any = {
  informationWarehouse: {},
  saveParma: {},
  subscribe(key: any, fn: any) {
    if (typeof this.informationWarehouse[key] === 'undefined') {
      this.informationWarehouse[key] = []
    }
    this.informationWarehouse[key].push(fn)
  },
  release(type: any, news: any) {
    const fns = this.informationWarehouse[type]
    if (typeof fns === 'undefined' || fns.length === 0) return
    fns.forEach((fn: any) => {
      fn(news)
    })
  },
  getParma(key: any) {
    if (!key) return null
    return this.saveParma[key]
  },
  setParma(key: any, val: any) {
    this.saveParma[key] = val
  }
}
export default task
