import { MAP_SIZE_X, MAP_SIZE_Y } from '../constants'
import { Helper } from '../helper'
import { Base } from '../base'
import map from 'lodash/map'
import sum from 'lodash/sum'

export class TheEndScreen extends Base {
  constructor() {
    super()

    this.score = 0
    this.finishing = this.after(3, () => this.compare(), null, false, true)
  }

  getLastBestScore() {
    return Helper.getFromStorage('TheBestScore')
  }

  setUpNewScore(score) {
    Helper.setToStorage('TheBestScore', score || 0)
  }

  countPlayersScore(players) {
    this.score = sum(map(players, 'score'))
  }

  compare() {
    const prevScore = this.getLastBestScore()

    if (!prevScore || this.score > prevScore) {
      this.setUpNewScore(this.score)
      this.dispatcher.dispatch('newScoreScreen', { score: this.score })
    } else {
      this.dispatcher.dispatch('startScreen')
    }
  }

  render(dt) {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.ctx.drawImage(this.assetsLoader.get('the_end'), 260, 370, 450, 90)
  }

  update(dt, players) {
    this.finishing(dt)
    this.countPlayersScore(players)
  }
}
