import { Enemy } from './enemy.js'
import { enemiesPoints } from './enemy-factory.js'

export class Enemy3 extends Enemy {
  constructor(...args) {
    super(...args)

    this.enemyId = 3
    this.upgrade = 2
    this.points = enemiesPoints[this.enemyId]
  }
}
