import { Entity } from '../entity.js'
import { Helper } from '../helper.js'
import find from 'lodash/find'
import filter from 'lodash/filter'

export class Bonus extends Entity {
  constructor(idxOfSprite, idxOfSpriteTransparent, ...args) {
    super(...args)

    this.idxOfSprite = idxOfSprite
    this.idxSpriteTansparent = idxOfSpriteTransparent
    this.showSprite = false
    this.zindex = 4
    this.finished = false
    this.points = 500
    this.animation = this.after(0.4, () => {
      this.showSprite = !this.showSprite
    })
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
    this.animation(dt)
    this.checkOthersCollision(others)
  }

  makeSound() {
    this.audioApi.play('bonusWasTaken')
  }

  destroy(item, others) {
    this.setBunusEffect(item, others)
    this.makeSound()

    if (item.type === 'player') {
      this.dispatcher.dispatch('countPoints', { player: item, points: this.points })
      this.dispatcher.dispatch('createPoints', { points: this.points, host: this })
    }
    this.finished = true
  }
}
