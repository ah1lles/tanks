import { Entity } from '../entity.js'
import { ANIMATION_SPEED } from '../constants.js'

export class Explosion extends Entity {
  constructor(framesCount, ...args) {
    super(...args)

    this.framesCount = framesCount
    this.animationTime = 0
    this.zindex = 3
    this.finished = false
  }

  get dx() {
    return this.animationTime > this.framesCount ? this.framesCount : Math.floor(this.animationTime) % this.framesCount
  }

  get() {
    let [img, ...params] = super.get()

    if (this.finished) {
      img = this.assetsLoader.get('transparent')
    }

    return [img, ...params]
  }

  update(dt) {
    this.animationTime += ANIMATION_SPEED * dt

    if (Math.floor(this.animationTime) >= this.framesCount) {
      this.destroy()
    }
  }

  destroy() {
    this.finished = true
  }
}
