import { MAP_SIZE_X, MAP_SIZE_Y } from '../constants'
import { Base } from '../base'
import { Animation } from '../animation/animation'
import map from 'lodash/map'
import invokeMap from 'lodash/invokeMap'

export class NewScoreScreen extends Base {
  constructor(score) {
    super()

    this.lifeTime = 9
    this.score = score
    this.soundLauched = false
    this.finishing = this.after(9, () => this.dispatcher.dispatch('startScreen'), null, false, true)
    this.title = new Animation(2, null, true, this.lifeTime, 200, 200, 588, 82, ['new_score_title'])
    this.symbols = []
    this.symbolsMap = {
      0: { width: 78, height: 82 },
      1: { width: 48, height: 82 },
      2: { width: 64, height: 82 },
      3: { width: 64, height: 82 },
      4: { width: 80, height: 82 },
      5: { width: 64, height: 82 },
      6: { width: 74, height: 82 },
      7: { width: 72, height: 82 },
      8: { width: 74, height: 82 },
      9: { width: 72, height: 82 }
    }
    this.buildSymbols()
  }

  buildSymbols() {
    let x = 300
    this.symbols = map(this.score.toString().split(''), sym => {
      const v = this.symbolsMap[sym]
      const s = new Animation(2, null, true, this.lifeTime, x, 400, v.width, v.height, [`symbol_${sym}`])
      x += v.width + 5
      return s
    })
  }

  makeSound() {
    if (!this.soundLauched) {
      this.audioApi.play('newScore')
      this.soundLauched = true
    }
  }

  render(dt) {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.title.render(dt)
    invokeMap(this.symbols, 'render', dt)
  }

  update(dt) {
    this.title.update(dt)
    invokeMap(this.symbols, 'update', dt)
    this.finishing(dt)
    this.makeSound()
  }
}
