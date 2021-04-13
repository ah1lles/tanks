import { AssetsLoader } from './assets-loader.js'
import { Dispatcher } from './dispatcher.js'
import { Canvas } from './canvas.js'
import { Helper } from './helper.js'
import { AudioApi } from './audio.js'

export class Entity {
  constructor(x, y, width, height, sprites) {
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

  get assetsLoader() {
    return AssetsLoader.getInstance()
  }

  get dispatcher() {
    return Dispatcher.getInstance()
  }

  get audioApi() {
    return AudioApi.getInstance()
  }

  get img() {
    return this.assetsLoader.get(this.currentSprite)
  }

  get ctx() {
    return Canvas.getInstance().ctx
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
    this.ctx.drawImage(...this.get())
  }

  destroy() {
    if (this.destroyable) {
      this.destroyed = true
    }
  }
}
