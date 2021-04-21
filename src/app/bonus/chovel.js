import { CHOVEL_DURATION } from '../constants.js'
import { Bonus } from './bonus.js'

export class Chovel extends Bonus {
  constructor(...args) {
    super(...args)

    this.limit = CHOVEL_DURATION
  }

  setBunusEffect(item, others) {
    this.dispatcher.dispatch('chovelBonusActivated', { limit: this.limit, host: item })
  }
}
