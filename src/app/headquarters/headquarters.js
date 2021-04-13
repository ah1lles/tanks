import { FIELD_END_Y, FIELD_START_X, TILE_SIZE } from '../constants.js'
import { Entity } from '../entity.js'
import { TilesMap, A } from '../maps.js'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import size from 'lodash/size'

export class Headquarters extends Entity {
  constructor(...args) {
    super(FIELD_START_X + TILE_SIZE * 12, FIELD_END_Y - TILE_SIZE * 2, TILE_SIZE * 2, TILE_SIZE * 2, ['headquarters'])

    this.destroyable = true
    this.passable = false
    this.gainHeadquarters = false
    this.chovelLimit = 0
    this.chovelTime = 0
    this.savedHeadquartersTiles = []
    this.newHeadquartersTiles = []
    this.defensiveTiles = [
      { x: this.x - TILE_SIZE, y: this.y + TILE_SIZE },
      { x: this.x - TILE_SIZE, y: this.y },
      { x: this.x - TILE_SIZE, y: this.y - TILE_SIZE },
      { x: this.x, y: this.y - TILE_SIZE },
      { x: this.x + TILE_SIZE, y: this.y - TILE_SIZE },
      { x: this.x + TILE_SIZE * 2, y: this.y - TILE_SIZE },
      { x: this.x + TILE_SIZE * 2, y: this.y },
      { x: this.x + TILE_SIZE * 2, y: this.y + TILE_SIZE }
    ]

    this.dispatcher.subscribe('chovelBonusActivated', e => this.handleChovelBonusActivation(e.data))
  }

  get dx() {
    return this.destroyed ? 1 : 0
  }

  createExplosion() {
    this.dispatcher.dispatch('createExplosion', {
      framesCount: 8,
      x: this.x - TILE_SIZE,
      y: this.y - TILE_SIZE,
      width: TILE_SIZE * 4,
      height: TILE_SIZE * 4,
      sprites: ['explosion2']
    })
  }

  compareTilesByPosition(tile, tilesPos) {
    return !!find(tilesPos, t => {
      return t.x === tile.x && t.y === tile.y
    })
  }

  handleChovelBonusActivation({ limit }) {
    if (size(this.newHeadquartersTiles) > 0) {
      this.dispatcher.dispatch('returnBackHeadquartersTiles', {
        oldTiles: [],
        newTiles: this.newHeadquartersTiles
      })
    }

    this.newHeadquartersTiles = map(this.defensiveTiles, v => {
      return new TilesMap[A].instant(v.x, v.y, TILE_SIZE, TILE_SIZE, TilesMap[A].sprites)
    })

    this.dispatcher.dispatch('buildNewHeadquartersTiles', {
      oldTiles: this.savedHeadquartersTiles,
      newTiles: this.newHeadquartersTiles
    })
    this.gainHeadquarters = true
    this.chovelLimit += limit
  }

  update(dt, tiles) {
    if (!this.gainHeadquarters) {
      this.savedHeadquartersTiles = filter(tiles, tile => this.compareTilesByPosition(tile, this.defensiveTiles))
    } else {
      this.chovelTime += dt

      if (this.chovelTime > this.chovelLimit) {
        this.gainHeadquarters = false
        this.chovelTime = 0
        this.chovelLimit = 0
        this.dispatcher.dispatch('returnBackHeadquartersTiles', {
          oldTiles: this.savedHeadquartersTiles,
          newTiles: this.newHeadquartersTiles
        })
        this.savedHeadquartersTiles = []
        this.newHeadquartersTiles = []
      }
    }
  }

  destroy() {
    super.destroy()
    this.createExplosion()
    this.audioApi.play('playerDied')
    this.dispatcher.dispatch('headquartersDestroyed')
    this.passable = true
  }
}
