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
import { Player } from './player/player.js'
import { Bullet } from './bullet/bullet.js'
import { Explosion } from './explosion/explosion.js'
import { BonusFactory } from './bonus/bonus-factory.js'
import { EnemyFactory } from './enemies/enemy-factory.js'
import filter from 'lodash/filter'
import map from 'lodash/map'
import invokeMap from 'lodash/invokeMap'
import sortBy from 'lodash/sortBy'
import size from 'lodash/size'

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
    this.bonuses = []
    this.bonusFactory = null
    this.enemyFactory = null
    this.playersOptions = {
      0: {
        keys: { ArrowUp: 'Up', ArrowRight: 'Right', ArrowDown: 'Down', ArrowLeft: 'Left', Space: 'Attack' },
        lives: this.options.playerLives,
        speed: PLAYER_SPEED,
        x: FIELD_START_X + TILE_SIZE * 9,
        y: FIELD_END_Y - TILE_SIZE * 2,
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2,
        sprites: ['tank_1', 'tank_2', 'tank_3', 'tank_4']
      },
      1: {
        keys: { KeyW: 'Up', KeyD: 'Right', KeyS: 'Down', KeyA: 'Left', KeyZ: 'Attack' },
        lives: this.options.playerLives,
        speed: PLAYER_SPEED,
        x: FIELD_START_X + TILE_SIZE * 9 + 6 * TILE_SIZE,
        y: FIELD_END_Y - TILE_SIZE * 2,
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2,
        sprites: ['tank_1', 'tank_2', 'tank_3', 'tank_4']
      }
    }
  }

  init() {
    document.addEventListener('keydown', e => this.keyDownHandler(e.code))

    this.dispatcher.subscribe('createBullet', e => this.handleBulletCreation(e.data))
    this.dispatcher.subscribe('createExplosion', e => this.handleExplosionCreation(e.data))
    this.dispatcher.subscribe('createEnemy', e => this.handleEnemyCreation(e.data))
    this.dispatcher.subscribe('createBonus', e => this.handleBonusCreation())
    this.dispatcher.subscribe('playerDestroyed', e => this.handlePlayerDestroying())

    window.addEventListener('focus', () => {
      if (this.pause && !this.pausePressed) {
        this.pauseGame(false)
      }
    })

    window.addEventListener('blur', () => {
      if (!this.pause) {
        this.pauseGame(true)
      }
    })
    this.start()
  }

  start() {
    this.enemyFactory = new EnemyFactory(this.playersCount > 1 ? 6 : 4)
    this.bonusFactory = new BonusFactory()
    this.createTiles()
    this.createPlayers()
    this.lastTime = Date.now()
    this.loop()
  }

  pauseGame(bool) {
    this.pause = bool
    if (!this.pause) {
      this.lastTime = Date.now()
      this.loop()
    }
  }

  keyDownHandler(key) {
    if (key === 'KeyP') {
      this.pausePressed = !this.pausePressed
      this.pauseGame(this.pausePressed)
    }
  }

  handlePlayerDestroying() {
    if (size(filter(this.players, { isOver: true })) === this.playersCount) {
      this.gameOver = true
    }
  }

  handleBulletCreation(data) {
    this.bullets.push(
      this.createBullet(
        data.host,
        data.from,
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
  }

  handleBonusCreation() {
    this.bonuses.push(this.bonusFactory.create())
  }

  createPlayer(keys, lives, speed, x, y, width, height, sprites) {
    return new Player(keys, lives, speed, x, y, width, height, sprites)
  }

  createPlayers() {
    this.players = map(Array(this.playersCount === 2 || this.playersCount === 1 ? this.playersCount : 1), (v, i) => {
      const opts = this.playersOptions[i]
      return this.createPlayer(opts.keys, opts.lives, opts.speed, opts.x, opts.y, opts.width, opts.height, opts.sprites)
    })
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

  createBullet(host, from, type, piercing, direction, x, y, width, height, sprites) {
    return new Bullet(host, from, type, piercing, direction, x, y, width, height, sprites)
  }

  createExplosion(framesCount, x, y, width, height, sprites) {
    return new Explosion(framesCount, x, y, width, height, sprites)
  }

  updateTiles() {
    this.tiles = filter(this.tiles, { destroyed: false })
  }

  updateExplosions(dt) {
    this.explosions = filter(this.explosions, { finished: false })
    invokeMap(this.explosions, 'update', dt)
  }

  updatePlayers(dt) {
    invokeMap(
      this.players,
      'update',
      dt,
      [...this.enemies, ...filter(this.players, { destroyed: false })],
      filter(this.tiles, { passable: false, destroyed: false })
    )
  }

  updateBullets(dt) {
    this.bullets = filter(this.bullets, bullet => {
      if (bullet.destroyed) {
        bullet.host?.removeBullet()
      }
      return !bullet.destroyed
    })

    invokeMap(
      this.bullets,
      'update',
      this.bullets,
      filter(this.tiles, { passable: false, destroyable: true, destroyed: false }),
      this.enemies,
      filter(this.players, { destroyed: false })
    )
    invokeMap(this.bullets, 'changePosition', dt)
  }

  updateEnemies(dt) {
    this.enemies = filter(this.enemies, { destroyed: false })
    invokeMap(
      this.enemies,
      'update',
      dt,
      [...this.enemies, ...filter(this.players, { destroyed: false })],
      filter(this.tiles, { passable: false, destroyed: false })
    )
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
    this.updateExplosions(dt)
    this.updateBullets(dt)
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
      }
    })
  }
}
