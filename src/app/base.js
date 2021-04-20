import { AssetsLoader } from './assets-loader'
import { AudioApi } from './audio'
import { Canvas } from './canvas'
import { Dispatcher } from './dispatcher'
import isNumber from 'lodash/isNumber'

export class Base {
  constructor() {}

  get assetsLoader() {
    return AssetsLoader.getInstance()
  }

  get dispatcher() {
    return Dispatcher.getInstance()
  }

  get ctx() {
    return Canvas.getInstance().ctx
  }

  get audioApi() {
    return AudioApi.getInstance()
  }

  after(time, func, startTime, preventAutoResetTime, callOnce) {
    let isCalled = false

    const check = (dt, ...args) => {
      check.timeCounter += dt

      if (check.timeCounter >= check.timeDelay) {
        if (!preventAutoResetTime) {
          check.timeCounter = 0
        }

        if (callOnce) {
          if (!isCalled) {
            isCalled = true
            func(...args)
          }
        } else {
          func(...args)
        }
      }
    }

    check.timeCounter = isNumber(startTime) ? startTime : 0
    check.timeDelay = time
    check.resetTime = () => {
      check.timeCounter = 0
    }

    return check
  }
}
