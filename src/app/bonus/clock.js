import { CLOCK_DURATION } from '../constants.js'
import { Bonus } from './bonus.js'

export class Clock extends Bonus {
  constructor(...args) {
    super(...args)

    this.freezeLimit = CLOCK_DURATION
  }

  setBunusEffect(item, others) {
    this.dispatcher.dispatch('clockBonusActivated', {
      limit: this.freezeLimit,
      entities: others,
      bonusOwnerType: item.type
    })
  }
}
