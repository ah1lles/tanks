import { SLOW_BULLET_SPEED, FAST_BULLET_SPEED, TILE_SIZE } from '../constants.js'
import { Entity } from '../entity.js'
import { Helper } from '../helper.js'
import some from 'lodash/some'
import map from 'lodash/map'
import filter from 'lodash/filter'
import difference from 'lodash/difference'

export class Bullet extends Entity {
  constructor(host, from, type, piercing, direction = 'Up', ...args) {
    super(...args)

    this.host = host
    this.from = from
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

  getOtherBullets(bullets) {
    return filter(difference(bullets, [this]), b => b.from !== this.from)
  }

  checkOtherBulletsCollision(bullets) {
    return some(
      map(bullets, b => {
        return Helper.collision(b, this)
      })
    )
  }

  checkItemsCollision(list) {
    return some(
      map(list, item => {
        const collide = Helper.collision(item, this)

        if (collide) {
          item.destroy(this)
        }
        return collide
      })
    )
  }

  update(bullets, tiles, enemies, players, headquarters) {
    let shouldDestroyBullet = false

    if (this.checkFieldEnd()) {
      if (this.checkItemsCollision(tiles)) {
        shouldDestroyBullet = true
      }

      if (this.checkOtherBulletsCollision(this.getOtherBullets(bullets))) {
        shouldDestroyBullet = true
      } else {
        if (this.from === 'player' && this.checkItemsCollision(enemies)) {
          shouldDestroyBullet = true
        }

        if (this.from === 'enemy' && this.checkItemsCollision(players)) {
          shouldDestroyBullet = true
        }

        if (Helper.collision(headquarters, this) && !headquarters.destroyed) {
          headquarters.destroy()
          shouldDestroyBullet = true
        }
      }
    } else {
      if (this.from === 'player') {
        this.audioApi.play('bulletIsOutOfField')
      }
      shouldDestroyBullet = true
    }

    if (shouldDestroyBullet) {
      this.destroy()
    }
  }

  destroy() {
    super.destroy()
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
