/* eslint-disable prettier/prettier */
import { Bricks } from './tile/bricks.js'
import { Armor } from './tile/armor.js'
import { Tree } from './tile/tree.js'
import { Water } from './tile/water.js'
import { Ice } from './tile/ice.js'

const B = 1
const A = 2
const T = 3
const W = 4
const I = 5

export const TilesMap = {
  [B]: {
    instant: Bricks,
    sprites: ['bricks']
  },
  [A]: {
    instant: Armor,
    sprites: ['armor']
  },
  [T]: {
    instant: Tree,
    sprites: ['tree']
  },
  [W]: {
    instant: Water,
    sprites: ['water']
  },
  [I]: {
    instant: Ice,
    sprites: ['ice']
  }
}

export const MAPS = {
  1: [
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,A,A,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,A,A,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,
    0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,
    B,B,0,0,B,B,B,B,0,0,0,0,0,0,0,0,0,0,B,B,B,B,0,0,B,B,
    A,A,0,0,B,B,B,B,0,0,0,0,0,0,0,0,0,0,B,B,B,B,0,0,A,A,
    0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,B,B,B,B,B,B,0,0,0,0,0,0,0,0,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,B,B,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,B,B,B,B,0,0,0,B,B,0,0,B,B,0,0,
    0,0,0,0,0,0,0,0,0,0,0,B,0,0,B,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,B,0,0,B,0,0,0,0,0,0,0,0,0,0,0,
  ]
}