import { Entity } from '../entity.js'
import { Helper } from '../helper.js'
import find from 'lodash/find'
import filter from 'lodash/filter'

export class Bonus extends Entity {
  constructor(idxOfSprite, idxOfSpriteTransparent, ...args) {
    super(...args)

    this.idxOfSprite = idxOfSprite
    this.animationDelay = 0.5
    this.animationTime = 0
    this.idxSpriteTansparent = idxOfSpriteTransparent
    this.showSprite = false
    this.zindex = 4
    this.finished = false
  }

  get dx() {
    return this.showSprite ? this.idxSpriteTansparent : this.idxOfSprite
  }

  checkOthersCollision(others) {
    const item = find(others, item => item.canTakeBonus && Helper.collision(item, this))

    if (item) {
      this.destroy(
        item,
        filter(others, v => v.type !== item.type)
      )
    }
  }

  setBunusEffect() {}

  update(dt, others) {
    this.animationTime += dt

    if (this.animationTime > this.animationDelay) {
      this.animationTime = 0
      this.showSprite = !this.showSprite
    }

    this.checkOthersCollision(others)
  }

  makeSound() {
    this.audioApi.play('bonusWasTaken')
  }

  destroy(item, others) {
    this.setBunusEffect(item, others)
    this.makeSound()
    this.finished = true
  }
}
