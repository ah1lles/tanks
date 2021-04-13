import { TILE_SIZE, SLOW_ENEMY_SPEED } from '../constants.js'
import { Entity } from '../entity.js'
import { Helper } from '../helper.js'
import difference from 'lodash/difference'
import find from 'lodash/find'
import filter from 'lodash/filter'

export class Tank extends Entity {
  constructor(speed, ...args) {
    super(...args)

    this.speed = speed || SLOW_ENEMY_SPEED
    this.type = ''
    this._x = this.x
    this._y = this.y
    this.direction = 'Down'
    this.imgPositions = {
      Up: 0,
      Right: 1,
      Down: 2,
      Left: 3
    }
    this.upgrade = 0
    this.idxSprite = 0
    this.shootDelay = 50
    this.nextShootTime = 50
    this.nextShootCoef = 200
    this.dischargeTime = 50
    this.dischargeCoef = 180
    this.bulletsCount = 0
    this.maxBullets = 1
    this.bulletType = 'slow'
    this.canTakeBonus = false
    this.bulletPiercing = false
    this.destroyed = false
    this.destroyable = true
    this.passable = false
    this.appearing = true
    this.frozen = false
    this.indestructible = false
    this.helmetsCount = 0
    this.zindex = 1
  }

  get dx() {
    return this.imgPositions[this.direction]
  }

  get maxBullets() {
    return this.upgrade > 1 ? 2 : 1
  }

  set maxBullets(val) {}

  get bulletType() {
    return this.upgrade > 0 ? 'fast' : 'slow'
  }

  set bulletType(val) {}

  get bulletPiercing() {
    return this.upgrade > 2 ? true : false
  }

  set bulletPiercing(val) {}

  get nextShootCoef() {
    return this.upgrade > 1 ? 300 : 200
  }

  set nextShootCoef(val) {}

  get dischargeCoef() {
    return this.upgrade > 1 ? 220 : 180
  }

  set dischargeCoef(val) {}

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
    return !!find(tiles, tile => Helper.collision(tile, this))
  }

  checkHeadquartersCollision(headquarters) {
    return !headquarters.destroyed && Helper.collision(headquarters, this)
  }

  checkOtherTanksCollision(others, posDiff) {
    let x = this.x
    let y = this.y
    let r = this.x + this.width
    let b = this.y + this.height

    return !!find(filter(difference(others, [this]), { appearing: false }), other => {
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
  }

  reactOnCollidion(dt) {
    this.balancePosition()
  }

  upgradeTank() {
    if (this.canTakeBonus) {
      this.upgrade++
    }
  }

  maxUpgradeTank() {
    if (this.canTakeBonus) {
      this.upgrade = 3
    }
  }

  increaseAmountOfLives() {}

  freezeTank() {
    this.frozen = true
  }

  unfreezeTank() {
    this.frozen = false
  }

  makeTankIndestructible() {
    this.helmetsCount++

    if (this.helmetsCount > 0) {
      this.indestructible = true
    }
  }

  makeTankDestructible() {
    this.helmetsCount = this.helmetsCount > 0 ? this.helmetsCount - 1 : 0

    if (this.helmetsCount === 0) {
      this.indestructible = false
    }
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

  changePosition(dt, others, tiles, headquarters) {
    if (this.checkTilesCollision(tiles) || !this.checkFieldEnd() || this.checkHeadquartersCollision(headquarters)) {
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

  update(dt, ...args) {
    if (this.frozen) return

    this.changePosition(dt, ...args)
    this.nextShootTime += this.nextShootCoef * dt
    this.dischargeTime += this.dischargeCoef * dt
  }

  destroy() {
    super.destroy()
    this.createExplosion()
  }
}
