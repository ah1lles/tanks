import './style.css'

import { AssetsLoader } from './app/assets-loader.js'
import { Canvas } from './app/canvas.js'
import { Dispatcher } from './app/dispatcher.js'
import { App } from './app/app.js'
import { resources } from './app/resources.js'

// original
// 1 tile = 8x8 px
// 1 block = 2x2 tiles
// Map = 13x14 blocks

const options = {
  playerLives: 2,
  level: 1
}

const assetsLoader = new AssetsLoader()
const canvas = new Canvas()
const dispatcher = new Dispatcher()
const app = new App(canvas.init(), dispatcher, options)

assetsLoader.load(resources).then(() => app.init())
