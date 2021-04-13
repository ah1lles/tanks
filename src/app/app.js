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
  PLAYER_SPEED,
  PLAYER_SPAWN_PROTECTION
} from './constants.js'
import { MAPS, TilesMap, A } from './maps.js'
import { Player } from './player/player.js'
import { Bullet } from './bullet/bullet.js'
import { BonusFactory } from './bonus/bonus-factory.js'
import { EnemyFactory } from './enemies/enemy-factory.js'
import { Animation } from './animation/animation.js'
import { HelmetOverlay } from './bonus/helmet-overlay.js'
import filter from 'lodash/filter'
import map from 'lodash/map'
import invokeMap from 'lodash/invokeMap'
import sortBy from 'lodash/sortBy'
import size from 'lodash/size'
import find from 'lodash/find'
import concat from 'lodash/concat'
import difference from 'lodash/difference'

export class App {
  constructor(ctx, dispatcher, audioApi, options) {
    this.ctx = ctx
    this.dispatcher = dispatcher
    this.audioApi = audioApi
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
    this.hardMode = false
    this.freezeEntities = false
    this.freezingLimit = 0
    this.freezingTime = 0
    this.bonusOwnerType = null
    this.gainHeadquarters = false
    this.chovelLimit = 0
    this.chovelTime = 0
    this.savedHeadquartersTiles = []
    this.newHeadquartersTiles = []
    this.helmetOverlays = []
    this.playersOptions = {
      0: {
        keys: { ArrowUp: 'Up', ArrowRight: 'Right', ArrowDown: 'Down', ArrowLeft: 'Left', Space: 'Attack' },
        lives: this.options.playerLives,
        speed: PLAYER_SPEED,
        x: FIELD_START_X + TILE_SIZE * 8,
        y: FIELD_END_Y - TILE_SIZE * 2,
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2,
        sprites: ['tank_1', 'tank_2', 'tank_3', 'tank_4']
      },
      1: {
        keys: { KeyW: 'Up', KeyD: 'Right', KeyS: 'Down', KeyA: 'Left', KeyZ: 'Attack' },
        lives: this.options.playerLives,
        speed: PLAYER_SPEED,
        x: FIELD_START_X + TILE_SIZE * 16,
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
    this.dispatcher.subscribe('clockBonusActivated', e => this.handleClockBonusActivation(e.data))
    this.dispatcher.subscribe('clockBonusActivated', e => this.handleClockBonusActivation(e.data))
    this.dispatcher.subscribe('chovelBonusActivated', e => this.handleChovelBonusActivation(e.data))
    this.dispatcher.subscribe('helmetBonusActivated', e => this.handleHelmetBonusActivation(e.data))

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
    this.enemyFactory = new EnemyFactory(this.playersCount > 1 ? 6 : 4, this.hardMode)
    this.bonusFactory = new BonusFactory()
    this.createTiles()
    this.createPlayers()
    this.startPlayerSpawnProtection()
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
    if (data.bonus) {
      this.bonuses = []
    }
    this.enemies.push(data)
  }

  handleBonusCreation() {
    this.bonuses.push(this.bonusFactory.create(filter(this.tiles, { destroyed: false })))
    console.log(this.bonuses)
  }

  handleClockBonusActivation({ limit, bonusOwnerType }) {
    this.freezeEntities = true
    this.freezingLimit = limit
    this.bonusOwnerType = bonusOwnerType
  }

  updateFreezingTime(dt) {
    if (!this.freezeEntities) return

    this.freezingTime += dt

    const entitiesName = this.bonusOwnerType === 'player' ? 'enemies' : 'players'

    invokeMap(this[entitiesName], 'freezeTank')

    if (this.freezingTime > this.freezingLimit) {
      this.freezeEntities = false
      this.freezingTime = 0
      invokeMap(this[entitiesName], 'unfreezeTank')
    }
  }

  compareTilesByPosition(tile, tilesPos) {
    return !!find(tilesPos, t => {
      return t.x === tile.x && t.y === tile.y
    })
  }

  handleChovelBonusActivation({ limit }) {
    const leftX = FIELD_START_X + TILE_SIZE * 11
    const rightX = FIELD_START_X + TILE_SIZE * 14
    const topY = FIELD_END_Y - TILE_SIZE * 3
    const tilesAroundHeadquarters = [
      { x: leftX, y: topY + TILE_SIZE * 2 },
      { x: leftX, y: topY + TILE_SIZE },
      { x: leftX, y: topY },
      { x: leftX + TILE_SIZE, y: topY },
      { x: leftX + TILE_SIZE * 2, y: topY },
      { x: rightX, y: topY },
      { x: rightX, y: topY + TILE_SIZE },
      { x: rightX, y: topY + TILE_SIZE * 2 }
    ]

    if (!this.gainHeadquarters) {
      this.savedHeadquartersTiles = filter(this.tiles, tile =>
        this.compareTilesByPosition(tile, tilesAroundHeadquarters)
      )
    }

    if (size(this.newHeadquartersTiles) > 0) {
      this.tiles = difference(this.tiles, this.newHeadquartersTiles)
    }

    this.newHeadquartersTiles = map(tilesAroundHeadquarters, v => {
      return new TilesMap[A].instant(v.x, v.y, TILE_SIZE, TILE_SIZE, TilesMap[A].sprites)
    })
    this.tiles = concat(difference(this.tiles, this.savedHeadquartersTiles), this.newHeadquartersTiles)
    this.gainHeadquarters = true
    this.chovelLimit += limit
  }

  updateGainHeadquartersTime(dt) {
    if (!this.gainHeadquarters) return

    this.chovelTime += dt

    if (this.chovelTime > this.chovelLimit) {
      this.gainHeadquarters = false
      this.chovelTime = 0
      this.chovelLimit = 0
      this.tiles = concat(difference(this.tiles, this.newHeadquartersTiles), this.savedHeadquartersTiles)
      this.savedHeadquartersTiles = []
      this.newHeadquartersTiles = []
    }
  }

  startPlayerSpawnProtection() {
    this.players.forEach(player =>
      this.handleHelmetBonusActivation({ entity: player, duration: PLAYER_SPAWN_PROTECTION })
    )
  }

  handleHelmetBonusActivation({ entity, duration }) {
    this.helmetOverlays.push(
      new HelmetOverlay(entity, 3, null, true, duration, entity.x, entity.y, entity.width, entity.height, [
        'bonus_animation'
      ])
    )
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
    return new Animation(framesCount, null, false, 0, x, y, width, height, sprites)
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

  updateBonuses(dt) {
    this.bonuses = filter(this.bonuses, { finished: false })
    invokeMap(this.bonuses, 'update', dt, [
      ...filter(this.enemies, { destroyed: false }),
      ...filter(this.players, { destroyed: false })
    ])
  }

  updateHelmetOverlays(dt) {
    this.helmetOverlays = filter(this.helmetOverlays, { finished: false })
    invokeMap(this.helmetOverlays, 'update', dt)
  }

  renderMap() {
    this.ctx.fillStyle = '#747474'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(FIELD_START_X, FIELD_START_Y, FIELD_SIZE_X, FIELD_SIZE_Y)
    this.ctx.save()
  }

  update(dt) {
    this.updateGainHeadquartersTime(dt)
    this.updateFreezingTime(dt)
    this.updateTiles()
    this.updatePlayers(dt)
    this.updateEnemies(dt)
    this.updateExplosions(dt)
    this.updateBullets(dt)
    this.updateBonuses(dt)
    this.updateHelmetOverlays(dt)
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
          ...this.explosions,
          ...this.bonuses,
          ...this.helmetOverlays
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
