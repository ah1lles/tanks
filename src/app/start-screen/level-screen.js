import { MAP_SIZE_X, MAP_SIZE_Y, TILE_SIZE } from '../constants'
import { MAPS } from '../maps'
import { AudioApi } from '../audio'
import { Canvas } from '../canvas'
import { Dispatcher } from '../dispatcher'
import size from 'lodash/size'

export class LevelScreen {
  constructor(canChangeLevel, level) {
    this.canChangeLevel = canChangeLevel || false
    this.level = level
    this.startGame = !this.canChangeLevel
    this.startingDelay = 1.5
    this.startingTime = 0
    this.soundLauched = false

    this.keyDownHandler = ({ code }) => {
      if (this.startGame) return

      if (code === 'ArrowRight') {
        this.level = this.level < size(MAPS) ? this.level + 1 : size(MAPS)
      }
      if (code === 'ArrowLeft') {
        this.level = this.level > 1 ? this.level - 1 : 1
      }
      if (code === 'Enter' && !this.startGame) {
        this.startGame = true
        this.makeSound()
      }
    }

    if (this.startGame) {
      this.makeSound()
    }

    document.addEventListener('keydown', this.keyDownHandler)
  }

  get dispatcher() {
    return Dispatcher.getInstance()
  }

  get audioApi() {
    return AudioApi.getInstance()
  }

  get ctx() {
    return Canvas.getInstance().ctx
  }

  makeSound() {
    if (!this.soundLauched) {
      this.audioApi.play('startLevel')
      this.soundLauched = true
    }
  }

  render() {
    this.ctx.fillStyle = '#747474'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.ctx.fillStyle = 'black'
    this.ctx.font = '42px sans-serif'
    this.ctx.fillText(`Level ${this.level}`, MAP_SIZE_X / 2 - TILE_SIZE * 2, MAP_SIZE_Y / 2)
  }

  update(dt) {
    if (this.startGame) {
      this.startingTime += dt
    }

    if (this.startingTime > this.startingDelay) {
      this.startGame = false
      this.startingTime = 0
      this.dispatcher.dispatch('chooseLevel', { level: this.level })
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.keyDownHandler)
  }
}
