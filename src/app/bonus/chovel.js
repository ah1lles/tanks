import { Bonus } from './bonus.js'

export class Chovel extends Bonus {
  constructor(...args) {
    super(...args)

    this.limit = 20
  }

  setBunusEffect(item, others) {
    this.dispatcher.dispatch('chovelBonusActivated', { limit: this.limit })
  }
}
