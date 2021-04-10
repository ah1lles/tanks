import { SLOW_BULLET_SPEED, FAST_BULLET_SPEED, TILE_SIZE } from '../constants.js'
import { Entity } from '../entity.js'
import { Helper } from '../helper.js'

export class Bullet extends Entity {
  constructor(host, type, piercing, direction = 'Up', ...args) {
    super(...args)

    this.host = host
    this.type = type
    this.piercing = piercing
    this.direction = direction
    this.passable = false
    this.destroyable = true
    this.zindex = 1
  }

  get dx() {
    switch (this.direction) {
      case 'Up':
        return 0
      case 'Right':
        return 1
      case 'Down':
        return 2
      case 'Left':
        return 3
      default:
        return 0
    }
  }

  get speed() {
    return this.type === 'slow' ? SLOW_BULLET_SPEED : FAST_BULLET_SPEED
  }

  changePosition(dt) {
    if (!this.checkFieldEnd()) {
      this.destroy()
    }

    switch (this.direction) {
      case 'Up':
        this.y -= this.speed * dt
        break
      case 'Right':
        this.x += this.speed * dt
        break
      case 'Down':
        this.y += this.speed * dt
        break
      case 'Left':
        this.x -= this.speed * dt
        break
      default:
        break
    }
  }

  destroy() {
    super.destroy()
    // this?.host?.removeBullet()
    this.dispatcher.dispatch('createExplosion', {
      framesCount: 8,
      x: this.x - this.width * 1.5,
      y: this.y - this.width * 1.5,
      width: TILE_SIZE * 2,
      height: TILE_SIZE * 2,
      sprites: ['explosion']
    })
  }
}
