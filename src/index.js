import './style.css'

import { AssetsLoader } from './app/assets-loader.js'
import { Canvas } from './app/canvas.js'
import { Dispatcher } from './app/dispatcher.js'
import { App } from './app/app.js'
import { resources } from './app/resources.js'
import { AudioApi } from './app/audio'

const assetsLoader = new AssetsLoader()
const canvas = new Canvas()
const dispatcher = new Dispatcher()
const audioApi = new AudioApi()
const app = new App()

assetsLoader.load(resources).then(() => {
  canvas.init()
  app.init()
})
