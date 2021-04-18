import { MAP_SIZE_X, MAP_SIZE_Y, TILE_SIZE } from '../constants'
import { Base } from '../base'
import size from 'lodash/size'

export class StartScreen extends Base {
  constructor() {
    super()

    this.currentLabel = 0
    this.hardMode = false
    this.playersCount = 1
    this.labels = [
      { x: 400, y: 500, name: 'playersCount', value: 1, text: () => '1 player' },
      { x: 400, y: 600, name: 'playersCount', value: 2, text: () => '2 player' },
      { x: 400, y: 700, name: 'hardMode', value: null, text: () => `hard-mode: ${this.hardMode ? 'on' : 'off'}` }
    ]
    this.pointer = {
      x: 300,
      y: this.labels[this.currentLabel].y,
      width: TILE_SIZE * 2,
      height: TILE_SIZE * 2
    }
    this.logo = {
      x: 250,
      y: 150,
      width: 540,
      height: 210
    }

    this.keyDownHandler = ({ code }) => {
      switch (code) {
        case 'ArrowDown':
          this.currentLabel = this.currentLabel < size(this.labels) - 1 ? this.currentLabel + 1 : this.currentLabel
          break
        case 'ArrowUp':
          this.currentLabel = this.currentLabel > 0 ? this.currentLabel - 1 : 0
          break
        case 'Enter':
          const label = this.labels[this.currentLabel]

          if (label.name === 'hardMode') {
            this.hardMode = !this.hardMode
          } else if (label.name === 'playersCount') {
            this.playersCount = label.value

            this.dispatcher.dispatch('getStartSettings', {
              playersCount: this.playersCount,
              hardMode: this.hardMode
            })
          }
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', this.keyDownHandler)
  }

  renderLogo() {
    this.ctx.drawImage(this.assetsLoader.get('logo'), this.logo.x, this.logo.y, this.logo.width, this.logo.height)
  }

  drawBackground() {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
  }

  renderLabels() {
    this.labels.forEach(label => {
      this.ctx.fillStyle = 'white'
      this.ctx.font = '42px sans-serif'
      this.ctx.fillText(label.text(), label.x, label.y)
    })
  }

  renderPointer() {
    this.ctx.drawImage(
      this.assetsLoader.get('tank_1'),
      this.pointer.width,
      0,
      TILE_SIZE * 2,
      TILE_SIZE * 2,
      this.pointer.x,
      this.labels[this.currentLabel].y - TILE_SIZE * 1.5,
      this.pointer.width,
      this.pointer.height
    )
  }

  render() {
    this.drawBackground()
    this.renderLogo()
    this.renderLabels()
    this.renderPointer()
  }

  update(dt) {}

  destroy() {
    document.removeEventListener('keydown', this.keyDownHandler)
  }
}
