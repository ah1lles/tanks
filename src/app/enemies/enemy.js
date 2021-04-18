import { Tank } from '../tank/tank.js'
import keys from 'lodash/keys'
import random from 'lodash/random'
import size from 'lodash/size'
import pull from 'lodash/pull'

export class Enemy extends Tank {
  constructor(hardMode, bonus, ...args) {
    super(...args)

    this.bonus = bonus
    this.type = 'enemy'
    this.canTakeBonus = hardMode
    this._idxSprite = 0
    this.upgrade = 0
    this.maxUpgrade = 0
    this.bulletFrom = 'enemy'
    this.idxBonusSprite = this.sprites.length - 1
    this.showBonusSprite = false
    this.moving = this.after(5, () => this.determineRandomDirection())
    this.shooting = this.after(0.5, () => this.shoutingDecision())
    this.bonusAnimation = this.after(0.2, () => {
      this.showBonusSprite = !this.showBonusSprite
    })
    this.deadlock = this.after(0.3, () => this.changeDirectionWhenLocked())
  }

  get idxSprite() {
    return this.showBonusSprite && this.bonus ? this.idxBonusSprite : this._idxSprite
  }

  set idxSprite(value) {
    this._idxSprite = value
  }

  generateChanceOfChangingDirection() {
    return random(100)
  }

  generateChanceOfShooting() {
    return random(100)
  }

  shoutingDecision() {
    if (this.generateChanceOfShooting() < 50) {
      this.shoot()
    }
  }

  determineRandomDirection() {
    if (this.generateChanceOfChangingDirection() < 40) {
      this.changeDirection(this.getNewPosition())
      this.deadlock.resetTime()
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

  makeBonusSound() {
    if (this.bonus) {
      this.audioApi.play('bonusEnemyHitted')
    }
  }

  tankIsLocked() {
    return this.y < this._y || this.y > this._y || this.x < this._x || this.x > this._x
  }

  changeDirectionWhenLocked(dt) {
    this.changeDirection(this.getNewPosition())
    this.moving.resetTime()
  }

  reactOnCollidion(dt) {
    super.reactOnCollidion()
    this.changeDirectionWhenLocked(dt)
  }

  update(dt, ...args) {
    if (this.frozen) return

    super.update(dt, ...args)

    if (!this.checkFieldEnd()) {
      this.deadlock(dt)
    }

    if (this.tankIsLocked()) {
      this.deadlock(dt)
    }

    this.moving(dt)
    this.shooting(dt)

    if (this.bonus) {
      this.bonusAnimation(dt)
    }
  }

  destroy(bullet, forceDestroy) {
    if (this.indestructible) return

    this.makeBonusSound()
    this.audioApi.play('enemyDied')

    if (!forceDestroy) {
      this.createBonus()
    }
    if (bullet?.from === 'player') {
      this.dispatcher.dispatch('countPoints', { player: bullet.host, points: this.points, enemyId: this.enemyId })
      this.dispatcher.dispatch('createPoints', { points: this.points, host: this })
    }
    this.dispatcher.dispatch('enemyWasDestroyed')
    super.destroy()
  }
}
