import { TILE_SIZE, SLOW_ENEMY_SPEED } from '../constants.js'
import { Entity } from '../entity.js'
import { Helper } from '../helper.js'
import difference from 'lodash/difference'
import map from 'lodash/map'
import some from 'lodash/some'
import filter from 'lodash/filter'

export class Tank extends Entity {
  constructor(speed, ...args) {
    super(...args)

    this.speed = speed || SLOW_ENEMY_SPEED
    this._x = this.x
    this._y = this.y
    this.direction = 'Down'
    this.imgPositions = {
      Up: 0,
      Right: 1,
      Down: 2,
      Left: 3
    }
    this.idxSprite = 0
    this.shootDelay = 50
    this.nextShootTime = 50
    this.nextShootCoef = 200
    this.dischargeTime = 50
    this.dischargeCoef = 180
    this.bulletsCount = 0
    this.maxBullets = 1
    this.bulletType = 'slow'
    this.bulletPiercing = false
    this.destroyed = false
    this.destroyable = true
    this.passable = false
    this.appearing = true
    this.zindex = 1
  }

  get dx() {
    return this.imgPositions[this.direction]
  }

  canShoot() {
    return (
      this.bulletsCount < this.maxBullets &&
      this.nextShootTime >= this.shootDelay &&
      this.dischargeTime >= this.shootDelay &&
      !this.destroyed
    )
  }

  shoot() {
    if (this.canShoot()) {
      this.createBullet()
      this.addBullet()
    }
  }

  createBullet() {
    this.dispatcher.dispatch('createBullet', {
      ...this.getBulletStartPosition(),
      host: this,
      from: this.bulletFrom,
      type: this.bulletType,
      piercing: this.bulletPiercing,
      direction: this.direction
    })
  }

  addBullet() {
    if (this.bulletsCount < this.maxBullets) {
      this.nextShootTime = 0
      this.bulletsCount++
    }
  }

  shouldDischarge() {
    return this.bulletsCount === 0
  }

  removeBullet() {
    if (this.bulletsCount > 0) {
      this.bulletsCount--

      if (this.shouldDischarge()) {
        this.dischargeTime = 0
      }
    }
  }

  createExplosion() {
    this.dispatcher.dispatch('createExplosion', {
      framesCount: 8,
      x: this.x - TILE_SIZE,
      y: this.y - TILE_SIZE,
      width: TILE_SIZE * 4,
      height: TILE_SIZE * 4,
      sprites: ['explosion2']
    })
  }

  getBulletStartPosition() {
    let x
    let y

    switch (this.direction) {
      case 'Up':
        x = this.x + this.width / 2 - TILE_SIZE / 2 / 2
        y = this.y - TILE_SIZE / 2
        break
      case 'Down':
        x = this.x + this.width / 2 - TILE_SIZE / 2 / 2
        y = this.y + this.height
        break
      case 'Right':
        x = this.x + this.width
        y = this.y + this.height / 2 - TILE_SIZE / 2 / 2
        break
      case 'Left':
        x = this.x - TILE_SIZE / 2 / 2
        y = this.y + this.height / 2 - TILE_SIZE / 2 / 2
        break
      default:
        break
    }

    return { x, y }
  }

  balancePosition() {
    this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE
    this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE
  }

  changeDirection(nextDirection) {
    if (this.direction !== nextDirection) {
      this.balancePosition()
    }

    this.direction = nextDirection
  }

  checkCollission(x, y, r, b, tank) {
    return Helper.collide(x, y, r, b, tank.x, tank.y, tank.x + tank.width, tank.y + tank.height)
  }

  checkTilesCollision(tiles) {
    return some(
      map(tiles, tile => {
        return Helper.collision(tile, this)
      })
    )
  }

  checkOtherTanksCollision(others, posDiff) {
    let x = this.x
    let y = this.y
    let r = this.x + this.width
    let b = this.y + this.height

    return some(
      map(filter(difference(others, [this]), { appearing: false }), other => {
        if (this.direction === 'Up') {
          return this.checkCollission(x, y - posDiff * 2, r, b, other)
        }
        if (this.direction === 'Right') {
          return this.checkCollission(x + posDiff * 2, y, r, b, other)
        }
        if (this.direction === 'Left') {
          return this.checkCollission(x - posDiff * 2, y, r, b, other)
        }
        if (this.direction === 'Down') {
          return this.checkCollission(x, y + posDiff * 2, r, b, other)
        }
      })
    )
  }

  reactOnCollidion(dt) {
    this.balancePosition()
  }

  handleOtherTankCollision(others, posDiff) {
    const collide = this.checkOtherTanksCollision(others, posDiff)

    if (collide) {
      if (this.appearing) {
        return false
      }

      return collide
    } else {
      this.appearing = false
    }

    return collide
  }

  change(posDiff) {
    switch (this.direction) {
      case 'Up':
        this.y -= posDiff
        break
      case 'Right':
        this.x += posDiff
        break
      case 'Down':
        this.y += posDiff
        break
      case 'Left':
        this.x -= posDiff
        break
      default:
        break
    }
  }

  changePosition(dt, others, tiles) {
    if (this.checkTilesCollision(tiles) || !this.checkFieldEnd()) {
      return this.balancePosition()
    }

    let posDiff = this.speed * dt

    if (this.handleOtherTankCollision(others, posDiff)) {
      this.reactOnCollidion(dt)
    } else {
      this.change(posDiff)
    }

    this._x = this.x
    this._y = this.y
  }

  update(dt, others, tiles) {
    this.changePosition(dt, others, tiles)
    this.nextShootTime += this.nextShootCoef * dt
    this.dischargeTime += this.dischargeCoef * dt
  }

  destroy() {
    super.destroy()
    this.createExplosion()
  }
}
