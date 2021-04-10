import { AssetsLoader } from '../assets-loader.js'
import { ENEMIES_TOTAL, FIELD_TILES_X, FAST_ENEMY_SPEED, SLOW_ENEMY_SPEED, TILE_SIZE } from '../constants.js'
import { Dispatcher } from '../dispatcher.js'
import { Enemy1 } from './enemy1.js'
import { Enemy2 } from './enemy2.js'
import { Enemy3 } from './enemy3.js'
import { Enemy4 } from './enemy4.js'
import includes from 'lodash/includes'

export class EnemyFactory {
  constructor(maxLivingEnemies) {
    this.creationDelay = 300
    this.creationTime = 300
    this.enemiesCount = 0
    this.currentEnemyIndex = 0
    this.level = 1
    this.maxEnemies = ENEMIES_TOTAL
    // this.maxLivingEnemies = maxLivingEnemies || 4
    this.maxLivingEnemies = 4
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
    this.enemiesSprites = {
      0: ['enemy_1'],
      1: ['enemy_2'],
      2: ['enemy_3'],
      3: ['enemy_4']
    }
    this.bonusTanks = [3, 10, 17]
    this.levelEnemiesSequence = {
      1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
    }
    this.enemiesClasses = {
      0: Enemy1,
      1: Enemy2,
      2: Enemy3,
      3: Enemy4
    }
    // this.levelEnemiesCount = {
    //   1: {
    //     0: 18,
    //     1: 2,
    //     2: 0,
    //     3: 0
    //   }
    // }
  }

  get assetsLoader() {
    return AssetsLoader.getInstance()
  }

  get dispatcher() {
    return Dispatcher.getInstance()
  }

  create() {
    if (
      this.creationTime > this.creationDelay &&
      // this.enemiesCount < this.maxLivingEnemies &&
      this.currentEnemyIndex < this.maxEnemies
    ) {
      console.log('CREATE ENEMY')
      const enemy = this.levelEnemiesSequence[this.level][this.currentEnemyIndex]
      this.dispatcher.dispatch(
        'createEnemy',
        new this.enemiesClasses[enemy](
          includes(this.bonusTanks, this.currentEnemyIndex),
          enemy === 1 ? FAST_ENEMY_SPEED : SLOW_ENEMY_SPEED,
          this.spots[this.currentSpot].x,
          this.spots[this.currentSpot].y,
          TILE_SIZE * 2,
          TILE_SIZE * 2,
          this.enemiesSprites[enemy]
        )
      )

      this.currentEnemyIndex++
      console.log(this.currentEnemyIndex, 'this.currentEnemyIndex')
      console.log(this.maxEnemies, 'this.maxEnemies')
      // this.enemiesCount++
      this.currentSpot = this.currentSpot < 2 ? this.currentSpot + 1 : 0
      this.creationTime = 0
    }
  }

  update(dt, enemies) {
    // console.log('update')
    if (enemies.length < this.maxLivingEnemies) {
      // console.log('Create enemy')
      this.creationTime += 100 * dt
      this.create()
    }
  }

  changeLevel(level) {
    this.level = level
  }
}