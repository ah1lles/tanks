import { TILE_SIZE } from '../constants'
import { Entity } from '../entity'

export class Point extends Entity {
  constructor(points, ...args) {
    super(...args)

    this.points = points
    this.zindex = 2
    this.showing = this.after(1, () => this.destroy())
  }

  render() {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '26px sans-serif'
    this.ctx.fillText(this.points, this.x + 10, this.y + TILE_SIZE + 10)
  }

  update(dt) {
    this.showing(dt)
  }

  destroy() {
    this.destroyed = true
  }
}
