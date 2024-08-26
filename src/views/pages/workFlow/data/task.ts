const task: any = {
  informationWarehouse: {},
  saveParma: {},
  subscribe(key, fn) {
    if (typeof this.informationWarehouse[key] === 'undefined') {
      this.informationWarehouse[key] = []
    }
    this.informationWarehouse[key].push(fn)
  },
  release(type, news) {
    const fns = this.informationWarehouse[type]
    if (typeof fns === 'undefined' || fns.length === 0) return
    fns.forEach((fn) => {
      fn(news)
    })
  },
  getParma(key) {
    if (!key) return null
    return this.saveParma[key]
  },
  setParma(key, val) {
    this.saveParma[key] = val
  }
}
export default task
