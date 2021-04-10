import { Tile } from './tile.js'

export class Tree extends Tile {
  constructor(...args) {
    super(...args)

    this.zindex = 2
  }
}
