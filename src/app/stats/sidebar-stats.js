import { FIELD_END_X, FIELD_END_Y, TILE_SIZE } from '../constants.js'
import { AssetsLoader } from '../assets-loader.js'
import { Dispatcher } from '../dispatcher.js'
import { Canvas } from '../canvas.js'
import map from 'lodash/map'

export class SidebarStats {
  constructor() {
    this.playersCount = 1
    this.lavelInfo = {
      img: {
        x: FIELD_END_X + TILE_SIZE,
        y: FIELD_END_Y - TILE_SIZE * 4,
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2
      },
      value: {
        x: FIELD_END_X + TILE_SIZE * 2 + 10,
        y: FIELD_END_Y - TILE_SIZE - 10
      }
    }
    this.livesInfo = [
      {
        text: {
          x: FIELD_END_X + TILE_SIZE,
          y: FIELD_END_Y - TILE_SIZE * 10 - 10
        },
        img: {
          x: FIELD_END_X + TILE_SIZE,
          y: FIELD_END_Y - TILE_SIZE * 10,
          width: TILE_SIZE,
          height: TILE_SIZE
        },
        value: {
          x: FIELD_END_X + TILE_SIZE * 2 + 5,
          y: FIELD_END_Y - TILE_SIZE * 9 - 5
        }
      },
      {
        text: {
          x: FIELD_END_X + TILE_SIZE,
          y: FIELD_END_Y - TILE_SIZE * 7 - 10
        },
        img: {
          x: FIELD_END_X + TILE_SIZE,
          y: FIELD_END_Y - TILE_SIZE * 7,
          width: TILE_SIZE,
          height: TILE_SIZE
        },
        value: {
          x: FIELD_END_X + TILE_SIZE * 2 + 5,
          y: FIELD_END_Y - TILE_SIZE * 6 - 5
        }
      }
    ]
  }

  get assetsLoader() {
    return AssetsLoader.getInstance()
  }

  get dispatcher() {
    return Dispatcher.getInstance()
  }

  get ctx() {
    return Canvas.getInstance().ctx
  }

  renderLevelInfo() {
    this.ctx.fillStyle = 'black'
    this.ctx.font = 'bold 32px sans-serif'
    this.ctx.fillText(this.level, this.lavelInfo.value.x, this.lavelInfo.value.y)
    this.ctx.drawImage(
      this.assetsLoader.get('level_icon'),
      this.lavelInfo.img.x,
      this.lavelInfo.img.y,
      this.lavelInfo.img.width,
      this.lavelInfo.img.height
    )
  }

  renderLivesInfo() {
    this.playersLives.forEach((value, i) => {
      const item = this.livesInfo[i]
      this.ctx.fillStyle = 'black'
      this.ctx.font = 'bold 32px sans-serif'
      this.ctx.fillText(`${i + 1} P`, item.text.x, item.text.y)
      this.ctx.drawImage(this.assetsLoader.get('lives_icon'), item.img.x, item.img.y, item.img.width, item.img.height)
      this.ctx.fillText(value, item.value.x, item.value.y)
    })
  }

  render() {
    this.renderLevelInfo()
    this.renderLivesInfo()
  }

  update(dt, players, level) {
    this.playersLives = map(players, 'lives')
    this.level = level
  }
}
