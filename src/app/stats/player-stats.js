import { Base } from '../base'
import get from 'lodash/get'
import merge from 'lodash/merge'

export class StatsPlayers extends Base {
  constructor() {
    super()

    this.store = {}

    this.handleCountPoints = ({ data }) => {
      data.player.addScore(data.points)

      if (data.enemyId) {
        const val = get(this.store, `${this.level}.${data.player.id}.${data.enemyId}`) || 0
        this.store = merge(this.store, { [this.level]: { [data.player.id]: { [data.enemyId]: val + 1 } } })
      }
    }

    this.dispatcher.subscribe('countPoints', this.handleCountPoints)
  }

  getStats() {
    return this.store
  }

  update(dt, level) {
    this.level = level
  }

  destroy() {
    this.dispatcher.unsubscribe('countPoints', this.handleCountPoints)
  }
}
