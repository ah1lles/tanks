import { FIELD_START_X, FIELD_START_Y, FIELD_END_X, FIELD_END_Y } from './constants.js'

export class Helper {
  constructor() {}

  static collision(a, b) {
    return Helper.collide(a.x, a.y, a.x + a.width, a.y + a.height, b.x, b.y, b.x + b.width, b.y + b.height)
  }

  static collide(l, t, r, b, l2, t2, r2, b2) {
    return !(r <= l2 || l >= r2 || b <= t2 || t >= b2)
  }

  static isInField(a) {
    return a.x >= FIELD_START_X && a.y >= FIELD_START_Y && a.x + a.width <= FIELD_END_X && a.y + a.height <= FIELD_END_Y
  }

  // static dispatchEvent(name, data) {
  //   document.dispatchEvent(
  //     new CustomEvent(name, {
  //       bubbles: true,
  //       detail: data
  //     })
  //   )
  // }
}
