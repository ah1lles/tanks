import { MAP_SIZE_X, MAP_SIZE_Y, TILE_SIZE } from '../constants'
import { Base } from '../base'
import { Helper } from '../helper'
import { enemiesPoints, enemiesSprites } from '../enemies/enemy-factory.js'
import toPairs from 'lodash/toPairs'
import head from 'lodash/head'
import size from 'lodash/size'
import keys from 'lodash/keys'
import sum from 'lodash/sum'
import values from 'lodash/values'
import zipObject from 'lodash/zipObject'
import map from 'lodash/map'
import every from 'lodash/every'
import isEmpty from 'lodash/isEmpty'

export class StatsScreen extends Base {
  constructor(stats, level, players) {
    super()

    this.playersIds = map(players, 'id').sort()
    this.stats = !isEmpty(stats)
      ? stats
      : {
          [level]: zipObject(
            this.playersIds,
            map(this.playersIds, v => {
              return {}
            })
          )
        }
    this.level = level
    this.playersCount = size(players)
    this.finish = false
    this.enemiesPoints = { ...enemiesPoints }
    this.pattern = {
      points: 0,
      enemies: 0
    }
    this.values = zipObject(
      this.playersIds,
      map(this.playersIds, v => {
        return {}
      })
    )
    this.playersCurrentPoints = zipObject(this.playersIds, map(players, 'score'))
    this.totals = zipObject(
      this.playersIds,
      map(this.playersIds, v => {
        return sum(values(this.stats[this.level] && this.stats[this.level][v]), (a, b) => a + b) || 0
      })
    )
    this.shouldRenderTotals = false
    this.idx = 0
    this.needToChangeIdx = {}
    this.bestScore = this.getBestScore()
    this.row = this.after(0.5, dt => this.updateRow(dt), null, true)
    this.pointing = this.after(0.15, () => this.updatePoints(), 0.15)
    this.finishing = this.after(2.5, () => this.dispatcher.dispatch('statsScreenFinished'), null, false, true)
  }

  getBestScore() {
    return Helper.getFromStorage('TheBestScore') || 0
  }

  updateRow(dt) {
    this.playersIds.forEach(id => {
      if (!this.values[id][this.idx]) {
        this.values[id][this.idx] = { ...this.pattern }
      }
    })

    this.playersIds.forEach(id => {
      if (!(this.stats[this.level] && this.stats[this.level][id] && this.stats[this.level][id][this.idx + 1])) {
        this.needToChangeIdx[id] = true
      }
    })

    this.pointing(dt)
  }

  checkRowIndex() {
    if (every(values(this.needToChangeIdx)) && size(values(this.needToChangeIdx)) === this.playersCount) {
      this.row.resetTime()
      this.idx++
      this.needToChangeIdx = {}
    }
  }

  checkFinish() {
    if (this.idx > size(keys(enemiesPoints)) - 1) {
      this.shouldRenderTotals = true
      this.finish = true
    }
  }

  updatePoints() {
    this.playersIds.forEach(id => {
      const val = this.stats[this.level] && this.stats[this.level][id] && this.stats[this.level][id][this.idx + 1]

      if (this.values[id][this.idx].enemies === val || !val) {
        this.needToChangeIdx[id] = true
      } else {
        this.values[id][this.idx].enemies++
        this.values[id][this.idx].points += enemiesPoints[this.idx + 1]
        this.audioApi.play('statsNumCount')
      }
    })
    this.checkRowIndex()
    this.checkFinish()
  }

  renderText(text, x, y, color, font) {
    this.ctx.fillStyle = color || 'white'
    this.ctx.font = font || '32px sans-serif'
    this.ctx.fillText(text, x, y)
  }

  renderBestScore() {
    this.renderText(`The Best Score`, 250, 100, '#de2800')
    this.renderText(`${this.bestScore}`, 600, 100, '#ff9a39')
  }

  renderLevel() {
    this.renderText(`Level ${this.level}`, 450, 170)
  }

  renderPlayers() {
    this.playersIds.forEach(v => {
      this.renderText(`${v} Player`, v * 300, 250, '#de2800')
      this.renderText(`${this.playersCurrentPoints[v]}`, v * 300, 300, '#ff9a39')
    })
  }

  renderEnemiesIcons() {
    let y = 250
    toPairs(this.enemiesPoints).forEach(([val, id], i) => {
      y += i + TILE_SIZE * 3
      const enemyImg = this.assetsLoader.get(head(enemiesSprites[i]))
      const arrowLeft = this.assetsLoader.get('arrow_left')

      this.ctx.drawImage(
        enemyImg,
        0,
        0,
        TILE_SIZE * 2,
        TILE_SIZE * 2,
        MAP_SIZE_X / 2 - TILE_SIZE,
        y,
        TILE_SIZE * 2,
        TILE_SIZE * 2
      )

      this.ctx.drawImage(arrowLeft, MAP_SIZE_X / 2 - TILE_SIZE * 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE)

      this.renderText(`points`, 250, y + TILE_SIZE + 10)

      if (size(this.playersIds) > 1) {
        const arrowRight = this.assetsLoader.get('arrow_right')
        this.ctx.drawImage(arrowRight, MAP_SIZE_X / 2 + TILE_SIZE, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE)

        this.renderText(`points`, 650, y + TILE_SIZE + 10)
      }
    })
  }

  renderTotal() {
    this.renderText(`Total`, 460, 800)

    if (!this.shouldRenderTotals) return

    this.playersIds.forEach(v => {
      this.renderText(`${this.totals[v]}`, v === 1 ? 380 : 590, 800)
    })
  }

  renderParticularEnemyCount() {
    let y = 295
    const posX = {
      1: { pointsX: 120, enemiesX: 380 },
      2: { pointsX: 820, enemiesX: 590 }
    }
    this.playersIds.forEach(id => {
      y = 295
      toPairs(this.values[id]).forEach(([idx, val], i) => {
        y += i + TILE_SIZE * 3
        this.renderText(`${val.points}`, posX[id].pointsX, y)
        this.renderText(`${val.enemies}`, posX[id].enemiesX, y)
      })
    })
  }

  render() {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, MAP_SIZE_X, MAP_SIZE_Y)
    this.renderBestScore()
    this.renderLevel()
    this.renderPlayers()
    this.renderEnemiesIcons()
    this.renderTotal()
    this.renderParticularEnemyCount()
  }

  update(dt) {
    if (this.finish) {
      this.finishing(dt)
    }

    if (this.idx < size(keys(enemiesPoints)) && !this.finish) {
      this.row(dt, dt)
    }
  }
}
