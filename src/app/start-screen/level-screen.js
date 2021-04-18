import { MAP_SIZE_X, MAP_SIZE_Y, TILE_SIZE } from '../constants'
import { Base } from '../base'
import { MAPS } from '../maps'
import size from 'lodash/size'

export class LevelScreen extends Base {
  constructor(canChangeLevel, level) {
    super()

    this.canChangeLevel = canChangeLevel || false
    this.level = level
    this.startGame = !this.canChangeLevel
    this.soundLauched = false
    this.starting = this.after(1.5, () => {
      this.startGame = false
      this.dispatcher.dispatch('chooseLevel', { level: this.level })
    })

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
    this.ctx.font = 'bold 42px sans-serif'
    this.ctx.fillText(`Level ${this.level}`, MAP_SIZE_X / 2 - TILE_SIZE * 2, MAP_SIZE_Y / 2)
  }

  update(dt) {
    if (this.startGame) {
      this.starting(dt)
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.keyDownHandler)
  }
}
