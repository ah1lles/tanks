import { ANIMATION_SPEED, MAP_SIZE_X, MAP_SIZE_Y } from '../constants'
import { Base } from '../base'

export class NewScoreScreen extends Base {
  constructor(score) {
    super()

    this.speed = ANIMATION_SPEED * 3
    this.isInfinity = true
    this.framesCount = 8
    this.animationTime = 0
    this.lifeTime = 0
    this.score = score
    this.soundLauched = false
    this.color = 'white'
    this.finishing = this.after(9, () => this.dispatcher.dispatch('startScreen'), null, false, true)
  }

  get dx() {
    const currentFrame = Math.floor(this.animationTime) % this.framesCount

    if (this.isInfinity) {
      return currentFrame > this.framesCount ? 0 : currentFrame
    }

    return this.animationTime > this.framesCount ? this.framesCount : currentFrame
  }

  makeSound() {
    if (!this.soundLauched) {
      this.audioApi.play('newScore')
      this.soundLauched = true
    }
  }

  renderText(text, x, y, font) {
    this.ctx.fillStyle = this.color
    this.ctx.font = font || '72px sans-serif'
    this.ctx.fillText(text, x, y)
  }

  renderTitle() {
    this.renderText(`New Score`, 300, 200)
  }

  renderScore() {
    this.renderText(`${this.score}`, 350, 450, '120px sans-serif')
  }

  render(dt) {
    this.animationTime += this.speed * dt
    this.lifeTime += dt

    this.color = this.dx <= 4 ? '#2735e4' : '#9f020a'

    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.renderTitle()
    this.renderScore()
  }

  update(dt) {
    this.finishing(dt)
    this.makeSound()
  }
}
