import { Bonus } from './bonus.js'

export class Helmet extends Bonus {
  constructor(...args) {
    super(...args)
  }

  setBunusEffect(item, others) {
    console.log(item, others)
  }

  // destroy() {
  //   super.destroy()
  // }
}
