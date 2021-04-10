import { Tile } from './tile.js'

export class Bricks extends Tile {
  constructor(...args) {
    super(...args)

    this.passable = false
    this.destroyable = true
    this._dx = 0
  }

  get dx() {
    return this._dx
  }

  set dx(value) {
    this._dx = value
  }

  destroy(bullet) {
    const d = bullet.direction

    if (bullet.piercing) {
      super.destroy()
      return
    }

    if (this.dx === 0) {
      if (d === 'Up') {
        this.dx = 4
      }
      if (d === 'Right') {
        this.dx = 1
      }
      if (d === 'Down') {
        this.dx = 2
      }
      if (d === 'Left') {
        this.dx = 3
      }
    } else if (this.dx === 1) {
      if (d === 'Up') {
        this.dx = 14
      }
      if (d === 'Right') {
        super.destroy()
      }
      if (d === 'Down') {
        this.dx = 11
      }
      if (d === 'Left') {
        super.destroy()
      }
    } else if (this.dx === 2) {
      if (d === 'Up') {
        super.destroy()
      }
      if (d === 'Right') {
        this.dx = 11
      }
      if (d === 'Down') {
        super.destroy()
      }
      if (d === 'Left') {
        this.dx = 12
      }
    } else if (this.dx === 3) {
      if (d === 'Up') {
        this.dx = 13
      }
      if (d === 'Right') {
        super.destroy()
        this.dx = 11
      }
      if (d === 'Down') {
        this.dx = 12
      }
      if (d === 'Left') {
        super.destroy()
      }
    } else if (this.dx === 4) {
      if (d === 'Up') {
        super.destroy()
      }
      if (d === 'Right') {
        this.dx = 14
      }
      if (d === 'Down') {
        super.destroy()
      }
      if (d === 'Left') {
        this.dx = 13
      }
    } else if (this.dx === 11 || this.dx === 12 || this.dx === 13 || this.dx === 14) {
      super.destroy()
    }
  }
}
