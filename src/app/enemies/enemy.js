import { Tank } from '../tank/tank.js'
import keys from 'lodash/keys'
import random from 'lodash/random'
import size from 'lodash/size'
import pull from 'lodash/pull'

export class Enemy extends Tank {
  constructor(bonus, ...args) {
    super(...args)

    this.bonus = bonus
    this.upgrade = 0
    this.maxUpgrade = 0
    this.deadlockDelay = 50
    this.deadlockTime = 0
    this.movingDelay = 200
    this.movingTime = 0
    this.shootingDelay = 50
    this.shootingTime = 50
    this.bulletFrom = 'enemy'
    this.bonusAnimationDelay = 50
    this.bonusAnimationTime = 0
    this.idxBonusSprite = this.sprites.length - 1
    this.showBonusSprite = false
  }

  get idxSprite() {
    return this.showBonusSprite && this.bonus ? this.idxBonusSprite : this.upgrade
  }

  set idxSprite(value) {
    this.upgrade = value
  }

  generateChanceOfChangingDirection() {
    return random(100)
  }

  generateChanceOfShooting() {
    return random(100)
  }

  shoutingDecision() {
    if (this.generateChanceOfShooting() < 4) {
      this.shoot()
      this.shootingTime = 0
    }
  }

  determineRandomDirection() {
    if (this.generateChanceOfChangingDirection() < 5) {
      this.changeDirection(this.getNewPosition())
      this.deadlockTime = 0
      this.movingTime = 0
    }
  }

  getNewPosition() {
    const directionKeys = pull(keys(this.imgPositions), this.direction)
    return directionKeys[random(size(directionKeys) - 1)]
  }

  createBonus() {
    if (this.bonus) {
      this.bonus = false
      this.dispatcher.dispatch('createBonus')
    }
  }

  tankIsLocked() {
    return this.y < this._y || this.y > this._y || this.x < this._x || this.x > this._x
  }

  changeDirectionWhenLocked(dt) {
    this.deadlockTime += 200 * dt
    if (this.deadlockTime > this.deadlockDelay) {
      this.changeDirection(this.getNewPosition())
      this.deadlockTime = 0
      this.movingTime = 0
    }
  }

  reactOnCollidion(dt) {
    super.reactOnCollidion()
    this.changeDirectionWhenLocked(dt)
  }

  update(dt, others, tiles) {
    super.update(dt, others, tiles)

    if (!this.checkFieldEnd()) {
      this.changeDirectionWhenLocked(dt)
    }

    if (this.tankIsLocked()) {
      this.changeDirectionWhenLocked(dt)
    }

    this.movingTime += 50 * dt
    this.shootingTime += 100 * dt

    if (this.movingTime > this.movingDelay) {
      this.determineRandomDirection()
    }

    if (this.shootingTime > this.shootingDelay) {
      this.shoutingDecision()
    }

    if (this.bonus) {
      this.bonusAnimationTime += 200 * dt

      if (this.bonusAnimationTime > this.bonusAnimationDelay) {
        this.bonusAnimationTime = 0
        this.showBonusSprite = !this.showBonusSprite
      }
    }
  }

  destroy() {
    this.createBonus()
    super.destroy()
  }
}
