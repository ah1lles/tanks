import { Bonus } from './bonus.js'
import invokeMap from 'lodash/invokeMap'

export class Grenade extends Bonus {
  constructor(...args) {
    super(...args)
  }

  setBunusEffect(item, others) {
    invokeMap(others, 'destroy', true)
  }
}
