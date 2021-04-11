import { Bonus } from './bonus.js'

export class Life extends Bonus {
  constructor(...args) {
    super(...args)
  }

  setBunusEffect(item, others) {
    item.increaseAmountOfLives()
  }
}
