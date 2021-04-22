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
  FIELD_END_X,
  ENEMY_SPAWN_DELAY
} from './constants.js'
import { Base } from './base.js'
import { MAPS, TilesMap } from './maps.js'
import { Player } from './player/player.js'
import { Bullet } from './bullet/bullet.js'
import { BonusFactory } from './bonus/bonus-factory.js'
import { EnemyFactory } from './enemies/enemy-factory.js'
import { Animation } from './animation/animation.js'
import { HelmetOverlay } from './bonus/helmet-overlay.js'
import { Headquarters } from './headquarters/headquarters.js'
import { Entity } from './entity.js'
import { SpawnAnimation } from './bonus/spawn-animation.js'
import { StartScreen } from './start-screen/start-screen.js'
import { LevelScreen } from './start-screen/level-screen.js'
import { SidebarStats } from './stats/sidebar-stats.js'
import { StatsPlayers } from './stats/player-stats.js'
import { Point } from './stats/point.js'
import { StatsScreen } from './stats/stats-screen.js'
import { GameOverScreen } from './game-over-screen/game-over-screen.js'
import { NewScoreScreen } from './game-over-screen/new-score-screen.js'
import { TextPopup } from './text-popup/text-popup.js'
import { TheEndScreen } from './game-over-screen/the-end-screen.js'
import filter from 'lodash/filter'
import map from 'lodash/map'
import invokeMap from 'lodash/invokeMap'
import sortBy from 'lodash/sortBy'
import size from 'lodash/size'
import concat from 'lodash/concat'
import difference from 'lodash/difference'
import initial from 'lodash/initial'

export class App extends Base {
  constructor() {
    super()

    this.playerLives = 2
    this.level = 1
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
    this.helmetOverlays = []
    this.enemyMarkers = []
    this.spawnAnimations = []
    this.bonusFactory = null
    this.enemyFactory = null
    this.headquarters = null
    this.startScreen = null
    this.levelScreen = null
    this.statsScreen = null
    this.theEndScreen = null
    this.sidebarStats = null
    this.hardMode = false
    this.freezeEntities = false
    this.freezingLimit = 0
    this.freezingTime = 0
    this.bonusOwnerType = null
    this.gameStarted = false
    this.gameOver = false
    this.playersOptions = {
      0: {
        keys: { ArrowUp: 'Up', ArrowRight: 'Right', ArrowDown: 'Down', ArrowLeft: 'Left', Space: 'Attack' },
        lives: this.playerLives,
        speed: PLAYER_SPEED,
        x: FIELD_START_X + TILE_SIZE * 8,
        y: FIELD_END_Y - TILE_SIZE * 2,
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2,
        sprites: ['tank_1', 'tank_2', 'tank_3', 'tank_4', 'tank_5']
      },
      1: {
        keys: { KeyW: 'Up', KeyD: 'Right', KeyS: 'Down', KeyA: 'Left', KeyQ: 'Attack' },
        lives: this.playerLives,
        speed: PLAYER_SPEED,
        x: FIELD_START_X + TILE_SIZE * 16,
        y: FIELD_END_Y - TILE_SIZE * 2,
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2,
        sprites: ['tank2_1', 'tank2_2', 'tank2_3', 'tank2_4', 'tank2_5']
      }
    }
  }

  init() {
    document.addEventListener('keydown', e => this.keyDownHandler(e.code))

    this.dispatcher.subscribe('createBullet', e => this.handleBulletCreation(e.data))
    this.dispatcher.subscribe('createExplosion', e => this.handleExplosionCreation(e.data))
    this.dispatcher.subscribe('createEnemy', e => this.handleEnemyCreation(e.data))
    this.dispatcher.subscribe('createBonus', e => this.handleBonusCreation())
    this.dispatcher.subscribe('playerDestroyed', e => this.handlePlayerOrHeadquartersDestroying())
    this.dispatcher.subscribe('headquartersDestroyed', e => this.handlePlayerOrHeadquartersDestroying())
    this.dispatcher.subscribe('clockBonusActivated', e => this.handleClockBonusActivation(e.data))
    this.dispatcher.subscribe('helmetBonusActivated', e => this.handleHelmetBonusActivation(e.data))
    this.dispatcher.subscribe('buildNewHeadquartersTiles', e => this.handleUpdateNewHeadquarterTiles(e.data))
    this.dispatcher.subscribe('returnBackHeadquartersTiles', e => this.handleReturnBackHeadquarterTiles(e.data))
    this.dispatcher.subscribe('createSpawnAnimation', e => this.handleSpawnAnimationCreation(e.data))
    this.dispatcher.subscribe('getStartSettings', e => this.handleGetStartSettings(e.data))
    this.dispatcher.subscribe('chooseLevel', e => this.handleChoosingLevel(e.data))
    this.dispatcher.subscribe('statsScreenFinished', e => this.handleStatsScreenFinishing())
    this.dispatcher.subscribe('levelCompleted', e => this.handleLevelCompleted())
    this.dispatcher.subscribe('createPoints', e => this.handlePointsCreation(e.data))
    this.dispatcher.subscribe('startScreen', e => this.createStartScreen())
    this.dispatcher.subscribe('newScoreScreen', e => this.createScoreScreen(e.data))
    this.dispatcher.subscribe('setGameOver', e => this.checkGameOver())

    window.addEventListener('focus', () => {
      if (this.pause && !this.pausePressed && this.gameStarted) {
        this.pauseGame(false)
      }
    })

    window.addEventListener('blur', () => {
      if (!this.pause && this.gameStarted) {
        this.pauseGame(true)
      }
    })

    this.startScreen = new StartScreen()
    this.lastTime = Date.now()
    this.loop()
  }

  createStartScreen() {
    this.clear()
    this.startScreen = new StartScreen()
  }

  createScoreScreen({ score }) {
    this.theEndScreen = null
    this.newScoreScreen = new NewScoreScreen(score)
  }

  handleGetStartSettings({ playersCount, hardMode }) {
    if (this.statsPlayers) {
      this.statsPlayers.destroy()
    }
    this.statsPlayers = new StatsPlayers()
    this.playersCount = playersCount
    this.hardMode = hardMode
    this.startScreen.destroy()
    this.startScreen = null
    this.createPlayers()
    this.levelScreen = new LevelScreen(true, 1)
  }

  handleChoosingLevel({ level }) {
    this.level = level
    this.start()
  }

  handleStatsScreenFinishing() {
    this.clear()

    if (this.gameOver) {
      this.gameOverScreen = new GameOverScreen()
    } else {
      this.level++

      if (this.level <= size(MAPS)) {
        this.levelScreen = new LevelScreen(false, this.level)
      } else {
        this.theEndScreen = new TheEndScreen()
      }
    }
  }

  start() {
    this.resetBonuses()
    this.clear()
    this.players = filter(this.players, { isOver: false })
    this.gameStarted = true
    this.enemyFactory = new EnemyFactory(this.playersCount > 1 ? 6 : 4, this.hardMode, this.level)
    this.bonusFactory = new BonusFactory()
    this.headquarters = new Headquarters()
    this.sidebarStats = new SidebarStats()
    this.createTiles()
    this.updatePlayersForNewLevel()
    this.createPlayerSpawnAnimations()
    this.createEnemyMarkers()
  }

  clear() {
    this.tiles = []
    this.bullets = []
    this.explosions = []
    this.enemies = []
    this.bonuses = []
    this.helmetOverlays = []
    this.enemyMarkers = []
    this.spawnAnimations = []
    this.headquarters = null
    this.statsScreen = null
    this.levelScreen?.destroy()
    this.levelScreen = null
    this.enemyFactory?.destroy()
    this.enemyFactory = null
    this.gameOverScreen = null
    this.newScoreScreen = null
    this.gameOverPopup = null
    this.theEndScreen = null
  }

  handleLevelCompleted() {
    if (this.gameOver) return

    this.clear()
    this.gameStarted = false
    this.createStatsScreen()
  }

  updatePlayersForNewLevel() {
    invokeMap(this.players, 'updateForNewLevel')
  }

  pauseGame(bool) {
    this.pause = bool
    if (!this.pause) {
      this.lastTime = Date.now()
      this.loop()
    } else if (this.pausePressed) {
      this.audioApi.play('pausePressed')
    }
    this.pausePopup = this.pause ? new TextPopup('PAUSE') : null
  }

  keyDownHandler(key) {
    if (key === 'KeyP') {
      this.pausePressed = !this.pausePressed
      this.pauseGame(this.pausePressed)
    }
  }

  checkGameOver() {
    if (size(filter(this.players, { isOver: true })) === size(this.players) || this.headquarters.destroyed) {
      this.gameOver = true
      this.gameStarted = false
    }
    this.gameOverPopup = this.gameOver ? new TextPopup('Game Over', 150) : null
  }

  handlePlayerOrHeadquartersDestroying() {
    if (this.gameOver && !this.gameStarted) {
      this.clear()
      this.createStatsScreen()
    }
  }

  handleBulletCreation(data) {
    this.bullets.push(
      this.createBullet(
        data.host,
        data.from,
        data.type,
        data.piercing,
        data.canDestroyTrees,
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

  handleSpawnAnimationCreation(data) {
    this.spawnAnimations.push(
      new SpawnAnimation(7, data.speed, true, data.duration, data.x, data.y, TILE_SIZE * 2, TILE_SIZE * 2, [
        'spawn_animation'
      ])
    )
  }

  handlePointsCreation({ points, host }) {
    this.points.push(new Point(points, host.x, host.y, host.width, host.height))
  }

  handleEnemyCreation(data) {
    if (data.bonus) {
      this.bonuses = []
    }
    this.enemyMarkers = initial(this.enemyMarkers)
    this.enemies.push(data)
  }

  handleBonusCreation() {
    if (size(this.bonuses) > 0) {
      this.bonuses = []
    }
    this.bonuses.push(this.bonusFactory.create(filter(this.tiles, { destroyed: false }), this.headquarters))
  }

  handleClockBonusActivation({ limit, bonusOwnerType }) {
    this.freezeEntities = true
    this.freezingLimit = limit
    this.bonusOwnerType = bonusOwnerType
    this.freezing = this.after(limit, entitiesName => {
      this.freezeEntities = false
      invokeMap(this[entitiesName], 'unfreezeTank')
    })
  }

  resetBonuses() {
    if (this.freezeEntities) {
      this.updateFreezingTime(this.freezingLimit)
    }
    this.helmetOverlays = []
  }

  resetFreezing(entitiesName) {
    this.freezeEntities = false
    invokeMap(this[entitiesName], 'unfreezeTank')
  }

  updateFreezingTime(dt) {
    if (!this.freezeEntities) return

    const entitiesName = this.bonusOwnerType === 'player' ? 'enemies' : 'players'

    invokeMap(this[entitiesName], 'freezeTank')

    this.freezing(dt, entitiesName)
  }

  createStatsScreen() {
    if (!this.statsScreen) {
      this.statsScreen = new StatsScreen(this.statsPlayers.getStats(), this.level, this.players)
    }
  }

  createEnemyMarkers() {
    let x = FIELD_END_X
    let y = FIELD_START_Y

    this.enemyMarkers = map(Array(20), (v, i) => {
      if (i % 2 === 0) {
        x = FIELD_END_X
        y += FIELD_START_Y
      }

      x += TILE_SIZE

      return new Entity(x, y, TILE_SIZE, TILE_SIZE, ['enemy_indicator'])
    })
  }

  createPlayerSpawnAnimations() {
    this.players.forEach(player =>
      this.handleSpawnAnimationCreation({ x: player.x, y: player.y, duration: ENEMY_SPAWN_DELAY / 2 })
    )
  }

  handleHelmetBonusActivation({ entity, duration }) {
    this.helmetOverlays.push(
      new HelmetOverlay(entity, 3, null, true, duration, entity.x, entity.y, entity.width, entity.height, [
        'bonus_animation'
      ])
    )
  }

  handleUpdateNewHeadquarterTiles({ oldTiles, newTiles }) {
    this.tiles = concat(difference(this.tiles, oldTiles), newTiles)
  }

  handleReturnBackHeadquarterTiles({ oldTiles, newTiles }) {
    this.tiles = concat(difference(this.tiles, newTiles), oldTiles)
  }

  createPlayer(id, keys, lives, speed, x, y, width, height, sprites) {
    return new Player(id, keys, lives, speed, x, y, width, height, sprites)
  }

  createPlayers() {
    this.players = map(Array(this.playersCount === 2 || this.playersCount === 1 ? this.playersCount : 1), (v, i) => {
      const opts = this.playersOptions[i]
      return this.createPlayer(
        i + 1,
        opts.keys,
        opts.lives,
        opts.speed,
        opts.x,
        opts.y,
        opts.width,
        opts.height,
        opts.sprites
      )
    })
  }

  createTiles() {
    const map = MAPS[this.level]
    let x = 0
    let y = 0

    this.tiles = []

    map.forEach((v, i) => {
      if (i % FIELD_TILES_X === 0) {
        x = 0
        y += TILE_SIZE
      }

      x += TILE_SIZE

      if (v) {
        this.tiles.push(new TilesMap[v].instant(x, y, TILE_SIZE, TILE_SIZE, TilesMap[v].sprites))
      }
    })
  }

  createBullet(host, from, type, piercing, canDestroyTrees, direction, x, y, width, height, sprites) {
    return new Bullet(host, from, type, piercing, canDestroyTrees, direction, x, y, width, height, sprites)
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
      this.pause,
      this.gameStarted,
      [...this.enemies, ...filter(this.players, { destroyed: false })],
      filter(this.tiles, { passable: false, destroyed: false }),
      this.headquarters
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
      filter(this.players, { destroyed: false }),
      this.headquarters,
      filter(this.tiles, { type: 'tree', destroyed: false })
    )
    invokeMap(this.bullets, 'changePosition', dt)
  }

  updateEnemies(dt) {
    this.enemies = filter(this.enemies, { destroyed: false })
    invokeMap(
      this.enemies,
      'update',
      dt,
      this.headquarters,
      [...this.enemies, ...filter(this.players, { destroyed: false })],
      filter(this.tiles, { passable: false, destroyed: false }),
      this.headquarters
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

  updateHeadquarters(dt) {
    this?.headquarters?.update(dt, filter(this.tiles, { destroyed: false }))
  }

  updateSpawnAnimations(dt) {
    this.spawnAnimations = filter(this.spawnAnimations, { finished: false })
    invokeMap(this.spawnAnimations, 'update', dt)
  }

  updatePoints(dt) {
    this.points = filter(this.points, { destroyed: false })
    invokeMap(this.points, 'update', dt)
  }

  renderMap() {
    this.ctx.fillStyle = '#747474'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(FIELD_START_X, FIELD_START_Y, FIELD_SIZE_X, FIELD_SIZE_Y)
    this.ctx.save()
  }

  update(dt) {
    this.updateFreezingTime(dt)
    this.updateTiles()
    this.updatePlayers(dt)
    this.updateEnemies(dt)
    this.updateExplosions(dt)
    this.updateBullets(dt)
    this.updateBonuses(dt)
    this.updateHelmetOverlays(dt)
    this.updateHeadquarters(dt)
    this.updateSpawnAnimations(dt)
    this.updatePoints(dt)
    this?.enemyFactory?.update(dt, this.enemies)
    this?.startScreen?.update(dt)
    this?.levelScreen?.update(dt)
    this?.statsPlayers?.update(dt, this.level)
    this?.sidebarStats?.update(dt, this.players, this.level)
    this?.statsScreen?.update(dt)
    this?.gameOverScreen?.update(dt, this.players)
    this?.theEndScreen?.update(dt, this.players)
    this?.newScoreScreen?.update(dt)
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
          ...this.helmetOverlays,
          ...this.enemyMarkers,
          ...this.spawnAnimations,
          ...this.points,
          this.headquarters,
          this.sidebarStats,
          this.startScreen,
          this.levelScreen,
          this.statsScreen,
          this.gameOverScreen,
          this.newScoreScreen,
          this.pausePopup,
          this.gameOverPopup,
          this.theEndScreen
        ],
        e => e && e.zindex
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
