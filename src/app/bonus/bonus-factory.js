import { FIELD_END_X, FIELD_END_Y, FIELD_START_X, FIELD_START_Y, TILE_SIZE } from '../constants.js'
import { Base } from '../base.js'
import { Chovel } from './chovel.js'
import { Clock } from './clock.js'
import { Grenade } from './grenade.js'
import { Helmet } from './helmet.js'
import { Life } from './life.js'
import { Pistol } from './pistol.js'
import { Star } from './star.js'
import random from 'lodash/random'
import filter from 'lodash/filter'
import find from 'lodash/find'
import size from 'lodash/size'

export class BonusFactory extends Base {
  constructor() {
    super()

    this.bonuses = {
      1: {
        instance: Helmet,
        sprite: ['bonuses']
      },
      2: {
        instance: Clock,
        sprite: ['bonuses']
      },
      3: {
        instance: Chovel,
        sprite: ['bonuses']
      },
      4: {
        instance: Star,
        sprite: ['bonuses']
      },
      5: {
        instance: Grenade,
        sprite: ['bonuses']
      },
      6: {
        instance: Life,
        sprite: ['bonuses']
      },
      7: {
        instance: Pistol,
        sprite: ['bonuses']
      }
    }
  }

  genarateChance() {
    return random(100)
  }

  getIdxOfNewBonus() {
    const chance = this.genarateChance()

    if (chance <= 24) {
      return 4 // 'Звезда'
    } else if (chance <= 48) {
      return 5 // 'Граната'
    } else if (chance <= 60) {
      return 1 // 'Каска'
    } else if (chance <= 72) {
      return 2 // 'часы'
    } else if (chance <= 84) {
      return 3 // 'лопата'
    } else if (chance <= 96) {
      return 6 // 'жизнь'
    } else if (chance <= 100) {
      return 7 // 'пистолет'
    }
  }

  generateBonusPosition() {
    const _x = Math.round(random(FIELD_START_X, FIELD_END_X) / TILE_SIZE) * TILE_SIZE
    const _y = Math.round(random(FIELD_START_Y, FIELD_END_Y) / TILE_SIZE) * TILE_SIZE
    const x = _x > FIELD_END_X - TILE_SIZE * 2 ? FIELD_END_X - TILE_SIZE * 2 : _x
    const y = _y > FIELD_END_Y - TILE_SIZE * 2 ? FIELD_END_Y - TILE_SIZE * 2 : _y
    return { x, y }
  }

  getTilesFromHeadquarters(headquarters) {
    if (!headquarters) return []

    return [
      { x: headquarters.x, y: headquarters.y, width: TILE_SIZE, height: TILE_SIZE },
      { x: headquarters.x, y: headquarters.y + TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE },
      { x: headquarters.x + TILE_SIZE, y: headquarters.y, width: TILE_SIZE, height: TILE_SIZE },
      { x: headquarters.x + TILE_SIZE, y: headquarters.y + TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }
    ]
  }

  getBonusTilesPos(pos) {
    return [
      { x: pos.x, y: pos.y },
      { x: pos.x + TILE_SIZE, y: pos.y },
      { x: pos.x, y: pos.y + TILE_SIZE },
      { x: pos.x + TILE_SIZE, y: pos.y + TILE_SIZE }
    ]
  }

  getTilesByBonusPos(tiles, bonusTilesPos) {
    return filter(tiles, tile => {
      return !!find(bonusTilesPos, t => {
        return t.x === tile.x && t.y === tile.y
      })
    })
  }

  getBonusPosition(tiles, result) {
    const res = result || {}
    const pos = this.generateBonusPosition()
    const bonusTilesPos = this.getBonusTilesPos(pos)
    const getTiles = this.getTilesByBonusPos(tiles, bonusTilesPos)
    const tilesCollided = filter(getTiles, { passable: false })

    if (size(tilesCollided) === 4) {
      return this.getBonusPosition(tiles, res)
    } else {
      res.x = pos.x
      res.y = pos.y
      return res
    }
  }

  create(tiles, headquarters) {
    const idx = this.getIdxOfNewBonus()
    const desc = this.bonuses[idx]
    const tilesHeadquarters = this.getTilesFromHeadquarters(headquarters)
    const pos = this.getBonusPosition([...tiles, ...tilesHeadquarters])

    return new desc.instance(idx, 0, pos.x, pos.y, TILE_SIZE * 2, TILE_SIZE * 2, desc.sprite)
  }
}
