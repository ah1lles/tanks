import without from 'lodash/without'

export class Dispatcher {
  #events

  constructor() {
    if (!Dispatcher._instance) {
      this.#events = {}
      Dispatcher._instance = this
    }
    return Dispatcher._instance
  }

  static getInstance() {
    return this._instance
  }

  subscribe(eventName, handler) {
    if (!this.#events[eventName]) {
      this.#events[eventName] = []
    }

    this.#events[eventName].push(handler)
  }

  dispatch(eventName, data) {
    const listeners = this.#events[eventName]

    if (listeners) {
      listeners.forEach(fn => fn({ type: eventName, data }))
    }
  }

  unsubscribe(eventName, handler) {
    const listeners = this.#events[eventName]

    listeners = without(listeners, handler)

    if (!listeners.length) {
      delete this.#events[eventName]
    }
  }
}
