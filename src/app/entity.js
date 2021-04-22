import { Helper } from './helper.js'
import { Base } from './base.js'

export class Entity extends Base {
  constructor(x, y, width, height, sprites) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.sprites = sprites
    this.dy = 0
    this.zindex = 0
    this.idxSprite = 0
    this.destroyed = false
    this.destroyable = false
    this.passable = true
  }

  get img() {
    return this.assetsLoader.get(this.currentSprite)
  }

  get currentSprite() {
    return this.sprites[this.idxSprite]
  }

  get dx() {
    return 0
  }

  get() {
    return [this.img, this.dx * this.width, this.dy, this.width, this.height, this.x, this.y, this.width, this.height]
  }

  checkFieldEnd() {
    return Helper.isInField(this)
  }

  render() {
    this.ctx.save()
    this.ctx.drawImage(...this.get())
    this.ctx.restore()
  }

  destroy() {
    if (this.destroyable) {
      this.destroyed = true
    }
  }
}
