import { Enemy } from './enemy.js'
import isBoolean from 'lodash/isBoolean'

export class Enemy4 extends Enemy {
  constructor(...args) {
    super(...args)

    this._idxSprite = 3
  }

  destroy(forceDestroy) {
    if (this._idxSprite === 0 || (isBoolean(forceDestroy) && forceDestroy)) {
      super.destroy(forceDestroy)
    } else {
      this.makeBonusSound()
      this.audioApi.play('shootInArmoredEnemy')
      this.createBonus()
      this._idxSprite--
    }
  }
}
