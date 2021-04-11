import { Bonus } from './bonus.js'

export class Star extends Bonus {
  constructor(...args) {
    super(...args)
  }

  setBunusEffect(item, others) {
    item.upgradeTank()
  }
}
