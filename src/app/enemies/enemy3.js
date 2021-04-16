import { Enemy } from './enemy.js'

export class Enemy3 extends Enemy {
  constructor(...args) {
    super(...args)

    this.upgrade = 2
  }

  destroy() {
    super.destroy()
  }
}
