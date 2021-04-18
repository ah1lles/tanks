import { Enemy } from './enemy.js'
import { enemiesPoints } from './enemy-factory.js'

export class Enemy1 extends Enemy {
  constructor(...args) {
    super(...args)

    this.enemyId = 1
    this.points = enemiesPoints[this.enemyId]
  }
}
