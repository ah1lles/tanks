import { Animation } from '../animation/animation.js'

export class HelmetOverlay extends Animation {
  constructor(host, ...args) {
    super(...args)

    this.host = host

    this.host?.makeTankIndestructible()
  }

  update(dt) {
    this.x = this.host.x
    this.y = this.host.y
    super.update(dt)
  }

  destroy() {
    super.destroy()
    this.host?.makeTankDestructible()
  }
}
