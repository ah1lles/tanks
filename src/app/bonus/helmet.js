import { HELMET_DURATION } from '../constants.js'
import { Bonus } from './bonus.js'

export class Helmet extends Bonus {
  constructor(...args) {
    super(...args)

    this.duration = HELMET_DURATION
  }

  setBunusEffect(item, others) {
    this.dispatcher.dispatch('helmetBonusActivated', { entity: item, duration: this.duration })
  }
}
