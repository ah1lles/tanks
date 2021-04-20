import { Tile } from './tile.js'

export class Water extends Tile {
  constructor(...args) {
    super(...args)

    this.type = 'water'
    this.passable = false
  }
}
