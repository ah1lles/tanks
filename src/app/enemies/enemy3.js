import { Enemy } from './enemy.js'

export class Enemy3 extends Enemy {
  constructor(...args) {
    super(...args)

    this.bulletType = 'fast'
  }

  destroy() {
    super.destroy()
  }
}
