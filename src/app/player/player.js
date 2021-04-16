import { PLAYER_SPAWN_PROTECTION } from '../constants.js'
import { Tank } from '../tank/tank.js'
import some from 'lodash/some'
import values from 'lodash/values'
import includes from 'lodash/includes'

export class Player extends Tank {
  constructor(keys, lives, ...args) {
    super(...args)

    this.type = 'player'
    this.keys = keys
    this.lives = lives
    this.direction = 'Up'
    this.upgrade = 3
    this.maxUpgrade = 3
    this.keysPressed = {}
    this.appearing = false
    this.bulletFrom = 'player'
    this.restoreTime = 0
    this.restoreDelay = 1.5
    this.isOver = false
    this.canTakeBonus = true
    this.startPositionX = this.x
    this.startPositionY = this.y
    this.movingSoundEnabled = false
    this.spawnAnimationCreated = false
    this.destroyed = true

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

  keyDownHandler(key) {
    if (!this.checkKey(key)) return

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
  }

  keyUpHandler(key) {
    if (!this.checkKey(key)) return

    this.keysPressed[this.keys[key]] = false
  }

  movingSoundControl() {
    if (this.isPressedMovingKeys()) {
      if (this.movingSoundEnabled && !this.destroyed && !this.isOver) {
        this.movingSoundEnabled = false
        this.audioApi.pause('awaitingPlayer')
        this.audioApi.play('movingPlayer')
      }
    } else {
      if (!this.movingSoundEnabled && !this.destroyed && !this.isOver) {
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

  restorePlayer(dt) {
    if (this.destroyed === true && !this.isOver) {
      this.restoreTime += dt

      this.createSpawnAnimation()

      if (this.restoreTime > this.restoreDelay) {
        this.appearing = true
        this.destroyed = false
        this.x = this.startPositionX
        this.y = this.startPositionY
        this.restoreTime = 0
        this.movingSoundEnabled = true
        this.spawnAnimationCreated = false
        this.dispatcher.dispatch('helmetBonusActivated', { entity: this, duration: PLAYER_SPAWN_PROTECTION })
        this.changeDirection('Up')
      }
    }
  }

  update(dt, ...args) {
    super.update(dt, ...args)

    this.restorePlayer(dt)
    this.movingSoundControl()
  }

  destroy(dt) {
    super.destroy()

    this.audioApi.play('playerDied')
    this.audioApi.pause('awaitingPlayer')
    this.audioApi.pause('movingPlayer')
    this.movingSoundEnabled = false

    if (this.lives === 0) {
      this.isOver = true
      this.dispatcher.dispatch('playerDestroyed')
    } else {
      this.lives--
      this.upgrade = 0
    }
  }
}
