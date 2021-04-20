import { Tile } from './tile.js'

export class Armor extends Tile {
  constructor(...args) {
    super(...args)

    this.passable = false
    this.destroyable = true
  }

  destroy(bullet) {
    if (bullet.piercing) {
      if (bullet.from === 'player') {
        this.audioApi.play('hitAndDestroyTile')
      }
      super.destroy()
    } else {
      if (bullet.from === 'player') {
        this.audioApi.play('bulletIsOutOfField')
      }
    }
  }
}
