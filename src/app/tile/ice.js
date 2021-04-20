import { Tile } from './tile.js'

export class Ice extends Tile {
  constructor(...args) {
    super(...args)

    this.type = 'ice'
  }
}
