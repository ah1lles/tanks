import { Bonus } from './bonus.js'
import invokeMap from 'lodash/invokeMap'

export class Clock extends Bonus {
  constructor(...args) {
    super(...args)

    this.freezeLimit = 10 // seconds
  }

  setBunusEffect(item, others) {
    this.dispatcher.dispatch('clockBonusActivated', {
      limit: this.freezeLimit,
      entities: others,
      bonusOwnerType: item.type
    })
  }
}
