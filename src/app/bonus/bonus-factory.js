import { AssetsLoader } from '../assets-loader.js'
import { Dispatcher } from '../dispatcher.js'

export class BonusFactory {
  constructor() {
    // this.sprites = ['bonuses']
  }

  get assetsLoader() {
    return AssetsLoader.getInstance()
  }

  get dispatcher() {
    return Dispatcher.getInstance()
  }

  create() {}
}
