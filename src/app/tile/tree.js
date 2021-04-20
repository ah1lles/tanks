import { Tile } from './tile.js'

export class Tree extends Tile {
  constructor(...args) {
    super(...args)

    this.type = 'tree'
    this.zindex = 2
  }

  destroy(bullet) {
    if (bullet.from === 'player') {
      this.audioApi.play('hitAndDestroyTile')
    }
    this.destroyed = true
  }
}
