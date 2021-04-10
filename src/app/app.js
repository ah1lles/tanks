import {
  TILE_SIZE,
  MAP_SIZE_X,
  MAP_SIZE_Y,
  FIELD_TILES_X,
  FIELD_START_X,
  FIELD_START_Y,
  FIELD_SIZE_X,
  FIELD_SIZE_Y,
  FIELD_END_Y,
  PLAYER_SPEED
} from './constants.js'
import { MAPS, TilesMap } from './maps.js'
import { Helper } from './helper.js'
import { Player } from './player/player.js'
import { Bullet } from './bullet/bullet.js'
import { Explosion } from './explosion/explosion.js'
import { EnemyFactory } from './enemies/enemy-factory.js'
import filter from 'lodash/filter'
import map from 'lodash/map'
import some from 'lodash/some'
import invokeMap from 'lodash/invokeMap'
import difference from 'lodash/difference'
import sortBy from 'lodash/sortBy'

export class App {
  constructor(ctx, dispatcher, options) {
    this.ctx = ctx
    this.dispatcher = dispatcher
    this.options = { ...options }
    this.level = this.options.level || 1
    this.isGameOver = false
    this.pause = false
    this.pausePressed = false
    this.lastTime = 0
    this.playersCount = 1
    this.players = []
    this.tiles = []
    this.bullets = []
    this.explosions = []
    this.enemies = []
    this.enemyFactory = null
  }

  init() {
    document.addEventListener('keydown', e => this.keyDownHandler(e.key))
    document.addEventListener('keyup', e => this.keyUpHandler(e.key))

    this.dispatcher.subscribe('createBullet', e => this.handleBulletCreation(e.data))
    this.dispatcher.subscribe('createExplosion', e => this.handleExplosionCreation(e.data))
    this.dispatcher.subscribe('createEnemy', e => this.handleEnemyCreation(e.data))
    this.dispatcher.subscribe('playerDestroyed', e => this.handlePlayerDestroying())
    // this.dispatcher.subscribe('destroyEmenies', e => this.handleEnemyDestroying())

    window.addEventListener('focus', () => {
      console.log('focus')
      if (this.pause && !this.pausePressed) {
        this.pauseGame(false)
      }
    })

    window.addEventListener('blur', () => {
      console.log('blur')
      if (!this.pause) {
        this.pauseGame(true)
      }
    })
    this.start()
  }

  start() {
    this.enemyFactory = new EnemyFactory(this.playersCount > 1 ? 6 : 4)
    this.createTiles()
    this.createPlayers()
    this.lastTime = Date.now()
    this.loop()
  }

  pauseGame(bool) {
    this.pause = bool
    if (!this.pause) {
      console.log('START LOOP')
      this.lastTime = Date.now()
      this.loop()
    }
    console.log(this.pause, 'pause')
  }

  keyDownHandler(key) {
    if (key === 'p') {
      this.pausePressed = !this.pausePressed
      this.pauseGame(this.pausePressed)
    }
  }

  keyUpHandler(key) {
    // console.log(key)
  }

  handlePlayerDestroying() {
    this.players = filter(this.players, { destroyed: false })

    if (!this.players.length) {
      this.gameOver = true
      // this.keyDownHandler('p')
    }
  }

  handleBulletCreation(data) {
    this.bullets.push(
      this.createBullet(
        data.host,
        data.type,
        data.piercing,
        data.direction,
        data.x,
        data.y,
        TILE_SIZE / 2,
        TILE_SIZE / 2,
        ['bullet']
      )
    )
  }

  handleExplosionCreation(data) {
    this.explosions.push(this.createExplosion(data.framesCount, data.x, data.y, data.width, data.height, data.sprites))
  }

  handleEnemyCreation(data) {
    this.enemies.push(data)
    console.log(this.enemies, data)
  }

  createPlayers() {
    const blockSize = TILE_SIZE * 2
    const playerStartX = FIELD_START_X + TILE_SIZE * 9
    const playerStartY = FIELD_END_Y - blockSize

    this.players.push(
      new Player(
        { ArrowUp: 'Up', ArrowRight: 'Right', ArrowDown: 'Down', ArrowLeft: 'Left', ' ': 'Attack' },
        this.options.playerLives,
        PLAYER_SPEED,
        playerStartX,
        playerStartY,
        blockSize,
        blockSize,
        ['tank_1', 'tank_2', 'tank_3', 'tank_4']
      )
    )

    if (this.playersCount === 2) {
      this.players.push(
        new Player(
          { w: 'Up', d: 'Right', s: 'Down', a: 'Left', z: 'Attack' },
          this.options.playerLives,
          PLAYER_SPEED,
          playerStartX + 6 * TILE_SIZE,
          playerStartY,
          blockSize,
          blockSize,
          ['tank_1', 'tank_2', 'tank_3', 'tank_4']
        )
      )
    }
  }

  createTiles() {
    const map = MAPS[this.level]
    let x = 0
    let y = 0

    map.forEach((v, i) => {
      if (i % FIELD_TILES_X === 0) {
        x = 0
        y += FIELD_START_Y
      }

      x += FIELD_START_X

      if (v) {
        this.tiles.push(new TilesMap[v].instant(x, y, TILE_SIZE, TILE_SIZE, TilesMap[v].sprites))
      }
    })
  }

  createBullet(host, type, piercing, direction, x, y, width, height, sprites) {
    return new Bullet(host, type, piercing, direction, x, y, width, height, sprites)
  }

  createExplosion(framesCount, x, y, width, height, sprites) {
    return new Explosion(framesCount, x, y, width, height, sprites)
  }

  // createEnemy(framesCount, x, y, width, height, sprites) {
  //   return new Explosion(framesCount, x, y, width, height, sprites)
  // }

  updateTiles() {
    this.tiles = filter(this.tiles, { destroyed: false })
  }

  updateExplosions(dt) {
    this.explosions = filter(this.explosions, { finished: false })
    invokeMap(this.explosions, 'update', dt)
  }

  updatePlayers(dt) {
    // const collisionPlayers = filter(this.players, player => {
    //   return some(
    //     map(filter(this.tiles, { passable: false, destroyed: false }), tile => {
    //       return Helper.collision(tile, player)
    //     })
    //   )
    // })

    // invokeMap(collisionPlayers, 'balancePosition')
    invokeMap(
      this.players,
      'update',
      dt,
      [...this.enemies, ...this.players],
      filter(this.tiles, { passable: false, destroyed: false })
    )
    // invokeMap(this.players, 'update', dt)
  }

  updateBullets(dt) {
    const tiles = filter(this.tiles, { passable: false, destroyable: true, destroyed: false })

    this.bullets.forEach(bullet => {
      if (bullet.destroyed) return

      const isInField = bullet.checkFieldEnd()
      let shouldDestroyBullet = false
      if (isInField) {
        tiles.forEach(tile => {
          const collide = Helper.collision(tile, bullet)

          if (collide) {
            tile.destroy(bullet)
            // bullet.destroy()
            shouldDestroyBullet = true
          }
        })

        if (bullet.host.bulletFrom === 'player') {
          filter(difference(this.bullets, [bullet]), b => b.host.bulletFrom !== 'player').forEach(b => {
            if (Helper.collision(b, bullet)) {
              b.destroy()
              shouldDestroyBullet = true
            }
          })
          filter(this.enemies, { destroyed: false }).forEach(enemy => {
            if (Helper.collision(enemy, bullet)) {
              enemy.destroy()
              shouldDestroyBullet = true
            }
          })
        }

        if (bullet.host.bulletFrom === 'enemy') {
          // console.log('Enemy destroyed player')
          filter(this.players, { destroyed: false }).forEach(player => {
            if (Helper.collision(player, bullet)) {
              player.destroy(dt)
              shouldDestroyBullet = true
            }
          })
        }
      } else {
        shouldDestroyBullet = true
        // bullet.destroy()
      }

      if (shouldDestroyBullet) {
        bullet.destroy()
      }
    })

    this.bullets = filter(this.bullets, bullet => {
      if (bullet.destroyed) {
        bullet?.host?.removeBullet()
      }
      return !bullet.destroyed
    })

    invokeMap(this.bullets, 'changePosition', dt)
  }

  updateEnemies(dt) {
    // const collisionTiles = filter(this.enemies, enemy => {
    //   return some(
    //     map(filter(this.tiles, { passable: false, destroyed: false }), tile => {
    //       return Helper.collision(tile, enemy)
    //     })
    //   )
    // })
    // invokeMap(collisionTiles, 'balancePosition')
    // invokeMap(difference(this.enemies, collisionTiles), 'changePosition', dt, [...this.enemies, ...this.players])
    // invokeMap(this.enemies, 'update', dt)
    this.enemies = filter(this.enemies, { destroyed: false })
    invokeMap(
      this.enemies,
      'update',
      dt,
      [...this.enemies, ...this.players],
      filter(this.tiles, { passable: false, destroyed: false })
    )
    // invokeMap(this.enemies, 'update', dt)
  }

  renderMap() {
    this.ctx.fillStyle = '#747474'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(FIELD_START_X, FIELD_START_Y, FIELD_SIZE_X, FIELD_SIZE_Y)
    this.ctx.save()
  }

  update(dt) {
    this.updateTiles()
    this.updatePlayers(dt)
    this.updateEnemies(dt)
    this.updateBullets(dt)
    this.updateExplosions(dt)
    this.enemyFactory.update(dt, this.enemies)
  }

  render(dt) {
    this.renderMap()

    invokeMap(
      sortBy(
        [
          ...this.tiles,
          ...filter(this.players, { destroyed: false }),
          ...this.enemies,
          ...this.bullets,
          ...this.explosions
        ],
        e => e.zindex
      ),
      'render',
      dt
    )
  }

  loop() {
    window.requestAnimationFrame(() => {
      const now = Date.now()
      const dt = (now - this.lastTime) / 1000

      this.update(dt)
      this.render(dt)

      this.lastTime = now

      if (!this.pause) {
        this.loop()
      } else {
        console.log('STOP LOOP')
      }
    })
  }
}
