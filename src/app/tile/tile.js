import { Entity } from '../entity.js'

export class Tile extends Entity {
  constructor(...args) {
    super(...args)
  }

  get() {
    let [img, ...params] = super.get()

    if (this.destroyed && this.destroyable) {
      img = this.assetsLoader.get('transparent')
    }
    return [img, ...params]
  }
}
