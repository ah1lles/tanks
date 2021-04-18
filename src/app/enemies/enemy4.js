import { Enemy } from './enemy.js'
import { enemiesPoints } from './enemy-factory.js'
import isBoolean from 'lodash/isBoolean'

export class Enemy4 extends Enemy {
  constructor(...args) {
    super(...args)

    this.enemyId = 4
    this._idxSprite = 3
    this.points = enemiesPoints[this.enemyId]
  }

  destroy(bullet, forceDestroy) {
    if (this.indestructible) return

    if (this._idxSprite === 0 || (isBoolean(forceDestroy) && forceDestroy)) {
      super.destroy(bullet, forceDestroy)
    } else {
      this.makeBonusSound()
      this.audioApi.play('shootInArmoredEnemy')
      this.createBonus()
      this._idxSprite--
    }
  }
}
