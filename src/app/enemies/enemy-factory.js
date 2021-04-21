import {
  FIELD_TILES_X,
  FAST_ENEMY_SPEED,
  SLOW_ENEMY_SPEED,
  TILE_SIZE,
  ENEMY_SPAWN_DELAY,
  ANIMATION_SPEED
} from '../constants.js'
import { Base } from '../base.js'
import { Enemy1 } from './enemy1.js'
import { Enemy2 } from './enemy2.js'
import { Enemy3 } from './enemy3.js'
import { Enemy4 } from './enemy4.js'
import includes from 'lodash/includes'
import size from 'lodash/size'

export const enemiesPoints = {
  1: 100,
  2: 200,
  3: 300,
  4: 400
}
export const enemiesSprites = {
  0: ['enemy_1', 'enemy_1_bonus'],
  1: ['enemy_2', 'enemy_2_bonus'],
  2: ['enemy_3', 'enemy_3_bonus'],
  3: ['enemy_4_grade_4', 'enemy_4_grade_3', 'enemy_4_grade_2', 'enemy_4_grade_1', 'enemy_4_bonus']
}

export class EnemyFactory extends Base {
  constructor(maxLivingEnemies, hardMode, level) {
    super()

    this.hardMode = hardMode
    this.creationDelay = ENEMY_SPAWN_DELAY
    this.spawnAnimationDelay = ENEMY_SPAWN_DELAY / 2
    this.completeLevelDelay = 3
    this.spawnAnimationCreated = false
    this.allEnemiesWereDestroyed = false
    this.enemiesCount = 0
    this.destroyedEnemyCount = 0
    this.currentEnemyIndex = 0
    this.level = level || 1
    this.maxEnemies = 20
    this.maxLivingEnemies = hardMode ? 6 : maxLivingEnemies || 4
    this.currentSpot = 1
    this.spots = {
      0: {
        x: TILE_SIZE,
        y: TILE_SIZE
      },
      1: {
        x: TILE_SIZE + TILE_SIZE * (FIELD_TILES_X / 2 - 1),
        y: TILE_SIZE
      },
      2: {
        x: TILE_SIZE + TILE_SIZE * (FIELD_TILES_X - 2),
        y: TILE_SIZE
      }
    }
    this.bonusTanks = [3, 10, 17]
    this.levelEnemiesSequence = {
      1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      2: [3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 3],
      4: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3],
      5: [2, 2, 2, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      6: [2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
      7: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3, 3]
    }
    this.enemiesClasses = {
      0: Enemy1,
      1: Enemy2,
      2: Enemy3,
      3: Enemy4
    }
    this.creationSpawnAnimation = this.after(
      this.spawnAnimationDelay,
      () => this.createSpawnAnimation(),
      this.spawnAnimationDelay
    )
    this.creationEnemy = this.after(this.creationDelay, () => this.createEnemy(), this.spawnAnimationDelay)
    this.allEnemiesDestroyed = this.after(this.completeLevelDelay, () => {
      this.allEnemiesWereDestroyed = false
      this.dispatcher.dispatch('levelCompleted')
    })
    this.handlerEnemyDestroying = () => {
      this.destroyedEnemyCount++
      this.allEnemiesWereDestroyed = this.destroyedEnemyCount >= this.maxEnemies
    }

    this.dispatcher.subscribe('enemyWasDestroyed', this.handlerEnemyDestroying)
  }

  createSpawnAnimation() {
    this.spawnAnimationCreated = true
    this.dispatcher.dispatch('createSpawnAnimation', {
      duration: this.spawnAnimationDelay,
      spped: ANIMATION_SPEED * 1.5,
      x: this.spots[this.currentSpot].x,
      y: this.spots[this.currentSpot].y
    })
  }

  createEnemy() {
    const enemy = this.levelEnemiesSequence[this.level][this.currentEnemyIndex]
    this.dispatcher.dispatch(
      'createEnemy',
      new this.enemiesClasses[enemy](
        this.hardMode,
        includes(this.bonusTanks, this.currentEnemyIndex),
        enemy === 1 ? FAST_ENEMY_SPEED : SLOW_ENEMY_SPEED,
        this.spots[this.currentSpot].x,
        this.spots[this.currentSpot].y,
        TILE_SIZE * 2,
        TILE_SIZE * 2,
        enemiesSprites[enemy]
      )
    )

    this.currentEnemyIndex++
    this.currentSpot = this.currentSpot < 2 ? this.currentSpot + 1 : 0
    this.spawnAnimationCreated = false
  }

  update(dt, enemies) {
    if (size(enemies) < this.maxLivingEnemies && this.currentEnemyIndex < this.maxEnemies) {
      if (!this.spawnAnimationCreated) {
        this.creationSpawnAnimation(dt)
      }
      this.creationEnemy(dt)
    }

    if (this.allEnemiesWereDestroyed) {
      this.allEnemiesDestroyed(dt)
    }
  }

  destroy() {
    this.dispatcher.unsubscribe('enemyWasDestroyed', this.handlerEnemyDestroying)
  }
}
