import { MAP_SIZE_X, MAP_SIZE_Y } from '../constants'
import { Base } from '../base'

export class TextPopup extends Base {
  constructor(text, shift) {
    super()

    this.text = text || ''
    this.shift = shift || 100
    this.color = '#b02203'
  }

  renderText(text, x, y, font) {
    this.ctx.font = font || 'bold 42px sans-serif'
    this.ctx.shadowColor = 'black'
    this.ctx.shadowBlur = 7
    this.ctx.lineWidth = 5
    this.ctx.strokeText(text, x, y)
    this.ctx.shadowBlur = 0
    this.ctx.fillStyle = this.color
    this.ctx.fillText(text, x, y)
  }

  render(dt) {
    this.renderText(this.text, MAP_SIZE_X / 2 - this.shift, MAP_SIZE_Y / 2 - 20)
  }
}
