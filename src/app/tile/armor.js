import { Tile } from './tile.js'

export class Armor extends Tile {
  constructor(...args) {
    super(...args)

    this.passable = false
    this.destroyable = true
  }

  destroy(bullet) {
    if (!bullet.piercing) return

    super.destroy()
  }
}
