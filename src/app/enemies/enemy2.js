import { Enemy } from './enemy.js'
import { enemiesPoints } from './enemy-factory.js'

export class Enemy2 extends Enemy {
  constructor(...args) {
    super(...args)

    this.enemyId = 2
    this.points = enemiesPoints[this.enemyId]
  }
}
