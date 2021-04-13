import { Bonus } from './bonus.js'

export class Life extends Bonus {
  constructor(...args) {
    super(...args)
  }

  makeSound() {
    this.audioApi.play('increaseCountOfLives')
  }

  setBunusEffect(item, others) {
    item.increaseAmountOfLives()
  }
}
