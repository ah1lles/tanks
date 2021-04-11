import { Enemy } from './enemy.js'

export class Enemy4 extends Enemy {
  constructor(...args) {
    super(...args)

    this.upgrade = 3
  }

  destroy() {
    if (this.upgrade === 0) {
      super.destroy()
    } else {
      this.createBonus()
      this.upgrade--
    }
  }
}
