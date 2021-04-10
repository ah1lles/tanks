import { MAP_SIZE_X, MAP_SIZE_Y } from './constants.js'

export class Canvas {
  #created

  constructor() {
    if (!Canvas._instance) {
      this.ctx = null
      this.#created = false
      Canvas._instance = this
    }
    return Canvas._instance
  }

  static getInstance() {
    return this._instance
  }

  init() {
    if (this.#created) return this.ctx

    const canvas = document.createElement('canvas')

    canvas.width = MAP_SIZE_X
    canvas.height = MAP_SIZE_Y

    this.ctx = canvas.getContext('2d')

    document.body.appendChild(canvas)

    this.#created = true

    return this.ctx
  }
}
