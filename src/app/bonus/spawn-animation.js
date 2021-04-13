import { Animation } from '../animation/animation.js'

export class SpawnAnimation extends Animation {
  constructor(...args) {
    super(...args)

    this.zindex = 0
  }
}
