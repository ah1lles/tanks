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
    this.destroying = this.after(3, () => this.dispatcher.dispatch('headquartersDestroyed'), null, false, true)
    this.dispatchingGameOver = this.after(0.1, () => this.dispatcher.dispatch('setGameOver'), null, false, true)

    this.handleChovelBonusActivation = ({ data }) => {
      this.activateChovelBonus(data)
    }

    this.dispatcher.subscribe('chovelBonusActivated', this.handleChovelBonusActivation)
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

  activateChovelBonus({ limit, host }) {
    if (size(this.newHeadquartersTiles) > 0) {
      this.dispatcher.dispatch('returnBackHeadquartersTiles', {
        oldTiles: [],
        newTiles: this.newHeadquartersTiles
      })
    }

    if (host.type === 'player') {
      this.newHeadquartersTiles = map(this.defensiveTiles, v => {
        return new TilesMap[A].instant(v.x, v.y, TILE_SIZE, TILE_SIZE, TilesMap[A].sprites)
      })
    } else {
      this.newHeadquartersTiles = []
    }

    this.dispatcher.dispatch('buildNewHeadquartersTiles', {
      oldTiles: this.savedHeadquartersTiles,
      newTiles: this.newHeadquartersTiles
    })
    this.gainHeadquarters = true
    this.activation = this.after(limit, () => this.returnBack())
  }

  returnBack() {
    this.gainHeadquarters = false
    this.dispatcher.dispatch('returnBackHeadquartersTiles', {
      oldTiles: this.savedHeadquartersTiles,
      newTiles: this.newHeadquartersTiles
    })
    this.savedHeadquartersTiles = []
    this.newHeadquartersTiles = []
  }

  update(dt, tiles) {
    if (!this.gainHeadquarters) {
      this.savedHeadquartersTiles = filter(tiles, tile => this.compareTilesByPosition(tile, this.defensiveTiles))
    } else {
      this.activation(dt)
    }

    if (this.destroyed) {
      this.dispatchingGameOver(dt)
      this.destroying(dt)
    }
  }

  destroy() {
    super.destroy()
    this.createExplosion()
    this.audioApi.play('playerDied')
    this.passable = true
  }

  resetSubscription() {
    this.dispatcher.unsubscribe('chovelBonusActivated', this.handleChovelBonusActivation)
  }
}
