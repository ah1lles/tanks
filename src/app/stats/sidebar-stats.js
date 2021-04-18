import { FIELD_END_X, FIELD_END_Y, TILE_SIZE } from '../constants.js'
import { Base } from '../base.js'
import map from 'lodash/map'

export class SidebarStats extends Base {
  constructor() {
    super()

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

  renderText(text, x, y, color, font) {
    this.ctx.fillStyle = color || 'black'
    this.ctx.font = font || 'bold 32px sans-serif'
    this.ctx.fillText(text, x, y)
  }

  renderImg(img, x, y, width, height) {
    this.ctx.drawImage(this.assetsLoader.get(img), x, y, width, height)
  }

  renderLevelInfo() {
    this.renderText(this.level, this.lavelInfo.value.x, this.lavelInfo.value.y)
    this.renderImg(
      'level_icon',
      this.lavelInfo.img.x,
      this.lavelInfo.img.y,
      this.lavelInfo.img.width,
      this.lavelInfo.img.height
    )
  }

  renderLivesInfo() {
    this.playersLives.forEach((value, i) => {
      const item = this.livesInfo[i]
      this.renderText(`${i + 1} P`, item.text.x, item.text.y)
      this.renderImg('lives_icon', item.img.x, item.img.y, item.img.width, item.img.height)
      this.renderText(value, item.value.x, item.value.y)
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
