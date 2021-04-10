import toPairs from 'lodash/toPairs'
import find from 'lodash/find'
import get from 'lodash/get'

export class AssetsLoader {
  constructor() {
    if (!AssetsLoader._instance) {
      this.cache = []
      AssetsLoader._instance = this
    }
    return AssetsLoader._instance
  }
  static getInstance() {
    return this._instance
  }

  async load(resources) {
    return (this.cache = await Promise.all(
      toPairs(resources).map(([src, name]) => {
        return this.loadItem(src, name)
      })
    ))
  }

  loadItem(name, src) {
    return new Promise(resolve => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        resolve({ [name]: img })
      }
    })
  }

  get(name) {
    return get(find(this.cache, name), name)
  }
}
