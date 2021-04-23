import { ANIMATION_SPEED, ENEMY_SPAWN_DELAY, PLAYER_SPAWN_PROTECTION } from '../constants.js'
import { Tank } from '../tank/tank.js'
import some from 'lodash/some'
import values from 'lodash/values'
import includes from 'lodash/includes'

export class Player extends Tank {
  constructor(id, keys, lives, ...args) {
    super(...args)

    this.id = id
    this.type = 'player'
    this.keys = keys
    this.lives = lives
    this.direction = 'Up'
    this.upgrade = 0
    this.maxUpgrade = 4
    this.keysPressed = {}
    this.appearing = false
    this.bulletFrom = 'player'
    this.restoreDelay = ENEMY_SPAWN_DELAY / 2
    this.isOver = false
    this.canTakeBonus = true
    this.startPositionX = this.x
    this.startPositionY = this.y
    this.movingSoundEnabled = false
    this.spawnAnimationCreated = false
    this.destroyed = true
    this.score = 0
    this.pointsForFreeLife = 20000
    this.pointsCounter = this.pointsForFreeLife
    this.lostControls = false
    this.restore = this.after(this.restoreDelay, () => this.restorePlayer())
    this.destroying = this.after(3, () => this.dispatcher.dispatch('playerDestroyed'), null, false, true)

    document.addEventListener('keydown', e => this.keyDownHandler(e.code))
    document.addEventListener('keyup', e => this.keyUpHandler(e.code))
  }

  get upgrade() {
    return this.idxSprite
  }

  set upgrade(value) {
    this.idxSprite = value > this.maxUpgrade ? this.maxUpgrade : value
  }

  get nextShootCoef() {
    return this.upgrade > 1 ? 350 : 400
  }

  set nextShootCoef(val) {}

  get dischargeCoef() {
    return this.upgrade > 1 ? 250 : 400
  }

  set dischargeCoef(val) {}

  get lostControls() {
    return this._lostControls
  }

  set lostControls(val) {
    if (this._lostControls !== val && val) {
      this.audioApi.pause('awaitingPlayer')
      this.audioApi.pause('movingPlayer')
    }
    if (this._lostControls !== val && !val) {
      this.audioApi.play('awaitingPlayer')
    }
    this._lostControls = val
  }

  keyDownHandler(key) {
    if (!this.checkKey(key) || this.lostControls) return

    if (this.keys[key] !== 'Attack') {
      this.keysPressed[this.keys[key]] = true
    }

    if (this.keys[key] === 'Down' || this.keys[key] === 'Up') {
      this.keysPressed.Left = false
      this.keysPressed.Right = false
    }

    if (this.keys[key] === 'Right' || this.keys[key] === 'Left') {
      this.keysPressed.Up = false
      this.keysPressed.Down = false
    }

    if (this.keys[key] === 'Attack') {
      this.shoot()
    } else {
      this.changeDirection(this.keys[key])
    }
    this.movingSoundControl()
  }

  keyUpHandler(key) {
    if (!this.checkKey(key)) return

    this.keysPressed[this.keys[key]] = false
    this.movingSoundControl()
  }

  addScore(points) {
    this.score += points
    this.pointsCounter -= points

    if (this.pointsCounter <= 0) {
      this.pointsCounter = this.pointsForFreeLife
      this.increaseAmountOfLives()
      this.audioApi.play('increaseCountOfLives')
    }
  }

  movingSoundControl() {
    if (this.isPressedMovingKeys()) {
      if (this.movingSoundEnabled && !this.destroyed && !this.isOver && !this.lostControls) {
        this.movingSoundEnabled = false
        this.audioApi.pause('awaitingPlayer')
        this.audioApi.play('movingPlayer')
      }
    } else {
      if (!this.movingSoundEnabled && !this.destroyed && !this.isOver && !this.lostControls) {
        this.movingSoundEnabled = true
        this.audioApi.pause('movingPlayer')
        this.audioApi.play('awaitingPlayer')
      }
    }
  }

  createSpawnAnimation() {
    if (!this.spawnAnimationCreated) {
      this.spawnAnimationCreated = true
      this.dispatcher.dispatch('createSpawnAnimation', {
        duration: this.restoreDelay,
        spped: ANIMATION_SPEED * 1.5,
        x: this.startPositionX,
        y: this.startPositionY
      })
    }
  }

  createBullet() {
    super.createBullet()
    this.audioApi.play('playerShoot')
  }

  isPressedMovingKeys() {
    return some(values(this.keysPressed))
  }

  shouldDischarge() {
    return this.upgrade > 1 ? super.shouldDischarge() && this.shootTime > this.shootDelay : super.shouldDischarge()
  }

  reactOnCollidion(dt) {
    if (this.isPressedMovingKeys()) return

    super.reactOnCollidion(dt)
  }

  checkKey(key) {
    return includes(Object.keys(this.keys), key)
  }

  increaseAmountOfLives() {
    this.lives++
  }

  changePosition(...args) {
    if (!this.isPressedMovingKeys()) return

    super.changePosition(...args)
  }

  updateForNewLevel() {
    this.bulletsCount = 0
    this.destroyed = true
    this.x = this.startPositionX
    this.y = this.startPositionY
  }

  restorePlayer() {
    this.appearing = true
    this.destroyed = false
    this.x = this.startPositionX
    this.y = this.startPositionY
    this.movingSoundEnabled = true
    this.spawnAnimationCreated = false
    this.dispatcher.dispatch('helmetBonusActivated', { entity: this, duration: PLAYER_SPAWN_PROTECTION })
    this.changeDirection('Up')
  }

  update(dt, pause, gameStarted, ...args) {
    this.lostControls = pause || !gameStarted ? true : false

    super.update(dt, ...args)

    if (this.destroyed && !this.isOver && gameStarted) {
      this.createSpawnAnimation()
      this.restore(dt)
    }

    if (this.isOver) {
      this.destroying(dt)
    }
  }

  destroy() {
    if (this.indestructible) return

    super.destroy()

    this.audioApi.play('playerDied')
    this.audioApi.pause('awaitingPlayer')
    this.audioApi.pause('movingPlayer')
    this.movingSoundEnabled = false

    if (this.lives === 0) {
      this.isOver = true
      this.dispatcher.dispatch('setGameOver')
    } else {
      this.lives--
      this.upgrade = 0
    }
  }
}
