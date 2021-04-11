import { Bonus } from './bonus.js'

export class Pistol extends Bonus {
  constructor(...args) {
    super(...args)
  }

  setBunusEffect(item, others) {
    item.maxUpgradeTank()
  }
}
