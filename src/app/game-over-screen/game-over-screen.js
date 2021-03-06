import { Helper } from '../helper'
import { MAP_SIZE_X, MAP_SIZE_Y } from '../constants'
import { Base } from '../base'
import sum from 'lodash/sum'
import map from 'lodash/map'

export class GameOverScreen extends Base {
  constructor() {
    super()

    this.soundLauched = false
    this.finishing = this.after(3, () => this.compare(), null, false, true)
  }

  makeSound() {
    if (!this.soundLauched) {
      this.audioApi.play('playerDefeat')
      this.soundLauched = true
    }
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

  render() {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.ctx.drawImage(this.assetsLoader.get('you_died'), 300, 300, 385, 237)
  }

  update(dt, players) {
    this.finishing(dt)
    this.makeSound()
    this.countPlayersScore(players)
  }
}
