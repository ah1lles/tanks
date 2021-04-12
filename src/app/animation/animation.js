import { ANIMATION_SPEED } from '../constants.js'
import { Entity } from '../entity.js'

export class Animation extends Entity {
  constructor(framesCount, speed, isInfinity, duration, ...args) {
    super(...args)

    this.speed = speed || ANIMATION_SPEED
    this.isInfinity = isInfinity || false
    this.framesCount = framesCount
    this.duration = duration ?? 10
    this.animationTime = 0
    this.lifeTime = 0
    this.zindex = 3
    this.finished = false
  }

  get dx() {
    const currentFrame = Math.floor(this.animationTime) % this.framesCount

    if (this.isInfinity) {
      return currentFrame > this.framesCount ? 0 : currentFrame
    }

    return this.animationTime > this.framesCount ? this.framesCount : currentFrame
  }

  get() {
    let [img, ...params] = super.get()

    if (this.finished) {
      img = this.assetsLoader.get('transparent')
    }

    return [img, ...params]
  }

  update(dt) {
    this.animationTime += this.speed * dt
    this.lifeTime += dt

    if (
      (!this.isInfinity && Math.floor(this.animationTime) >= this.framesCount) ||
      (this.isInfinity && this.lifeTime > this.duration)
    ) {
      this.destroy()
    }
  }

  destroy() {
    this.finished = true
  }
}
