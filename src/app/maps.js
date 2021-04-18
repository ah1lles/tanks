/* eslint-disable prettier/prettier */
import { Bricks } from './tile/bricks.js'
import { Armor } from './tile/armor.js'
import { Tree } from './tile/tree.js'
import { Water } from './tile/water.js'
import { Ice } from './tile/ice.js'

export const B = 1
export const A = 2
export const T = 3
export const W = 4
export const I = 5

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
  ],
  2: [
    0,0,0,0,0,0,A,A,0,0,0,0,0,0,A,A,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,A,A,0,0,0,0,0,0,A,A,0,0,0,0,0,0,0,0,0,0,
    0,0,B,B,0,0,A,A,0,0,0,0,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,A,A,0,0,0,0,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,0,0,0,0,0,0,B,B,B,B,0,0,B,B,A,A,B,B,0,0,
    0,0,B,B,0,0,0,0,0,0,0,0,B,B,B,B,0,0,B,B,A,A,B,B,0,0,
    0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,A,A,0,0,0,0,0,0,
    0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,A,A,0,0,0,0,0,0,
    T,T,0,0,0,0,B,B,0,0,0,0,A,A,0,0,0,0,B,B,T,T,B,B,A,A,
    T,T,0,0,0,0,B,B,0,0,0,0,A,A,0,0,0,0,B,B,T,T,B,B,A,A,
    T,T,T,T,0,0,0,0,0,0,B,B,0,0,0,0,A,A,0,0,T,T,0,0,0,0,
    T,T,T,T,0,0,0,0,0,0,B,B,0,0,0,0,A,A,0,0,T,T,0,0,0,0,
    0,0,B,B,B,B,B,B,T,T,T,T,T,T,A,A,0,0,0,0,T,T,B,B,0,0,
    0,0,B,B,B,B,B,B,T,T,T,T,T,T,A,A,0,0,0,0,T,T,B,B,0,0,
    0,0,0,0,0,0,A,A,T,T,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    0,0,0,0,0,0,A,A,T,T,B,B,0,0,B,B,0,0,B,B,0,0,B,B,0,0,
    A,A,B,B,0,0,A,A,0,0,B,B,0,0,B,B,0,0,0,0,0,0,B,B,0,0,
    A,A,B,B,0,0,A,A,0,0,B,B,0,0,B,B,0,0,0,0,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,B,B,B,B,0,0,B,B,A,A,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,B,B,B,B,0,0,B,B,A,A,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,B,B,B,B,0,0,0,0,0,0,0,0,0,0,
    0,0,B,B,0,0,B,B,0,0,B,B,B,B,B,B,0,0,0,0,0,0,0,0,0,0,
    0,0,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,0,0,0,0,0,B,B,B,B,0,0,0,B,B,0,0,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,B,0,0,B,0,0,0,B,B,B,B,B,B,0,0,
    0,0,B,B,0,0,B,B,0,0,0,B,0,0,B,0,0,0,B,B,B,B,B,B,0,0,
  ],
  3: [
    0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,
    0,0,T,T,T,T,T,T,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,T,T,T,T,T,T,B,B,0,0,0,0,0,0,0,0,0,0,A,A,A,A,A,A,
    B,B,T,T,T,T,T,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    B,B,T,T,T,T,T,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    T,T,T,T,T,T,T,T,0,0,0,0,0,0,B,B,0,0,B,B,B,B,B,B,B,0,
    T,T,T,T,T,T,T,T,0,0,0,0,0,0,B,B,0,0,B,B,B,B,B,B,B,0,
    T,T,T,T,T,T,T,T,B,B,B,B,B,B,B,B,0,0,B,B,0,0,0,B,0,0,
    T,T,T,T,T,T,T,T,B,B,B,B,B,B,0,0,0,0,B,B,0,0,0,B,0,0,
    T,T,T,T,T,T,T,T,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,B,0,0,
    T,T,T,T,T,T,T,T,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,B,0,0,
    0,0,T,T,0,0,0,0,0,0,0,0,A,A,A,A,A,A,0,0,0,0,T,T,0,0,
    0,0,T,T,0,0,0,0,0,0,0,0,A,A,A,A,A,A,0,0,0,0,T,T,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,T,T,T,T,T,T,T,
    0,0,B,B,0,0,B,B,0,0,0,0,0,0,0,0,0,0,T,T,T,T,T,T,T,T,
    B,B,B,0,0,B,B,B,B,0,0,B,B,B,B,B,B,B,T,T,T,T,T,T,T,T,
    B,B,B,0,0,B,B,B,B,0,0,B,0,0,0,0,0,0,T,T,T,T,T,T,T,T,
    0,0,0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,T,T,T,T,T,T,T,T,
    0,0,0,0,0,0,0,0,0,0,B,B,0,0,B,B,B,B,T,T,T,T,T,T,T,T,
    B,B,0,0,0,0,A,0,0,0,0,0,0,0,B,B,B,B,T,T,T,T,T,T,0,0,
    B,B,0,0,0,0,A,0,0,0,0,0,0,0,0,0,0,0,T,T,T,T,T,T,0,0,
    B,B,B,B,0,0,A,0,0,0,0,0,0,0,0,0,0,0,T,T,T,T,T,T,0,0,
    B,B,B,B,0,0,A,0,0,0,0,B,B,B,B,0,0,0,T,T,T,T,T,T,0,0,
    A,A,B,B,B,B,0,0,0,0,0,B,0,0,B,0,0,0,B,B,0,0,0,0,0,0,
    A,A,B,B,B,B,0,0,0,0,0,B,0,0,B,0,0,0,B,B,0,0,0,0,0,0,
  ],
  4: [
    0,0,T,T,T,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,T,0,0,
    0,0,T,T,T,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,T,0,0,
    T,T,T,T,0,0,0,0,0,0,B,B,B,B,0,0,0,0,0,0,0,0,0,0,T,T,
    T,T,T,T,0,0,0,0,B,B,B,B,B,B,B,B,B,B,0,0,0,0,0,0,T,T,
    T,T,0,0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,A,A,
    T,T,0,0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,
    A,A,0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,
    0,0,0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,
    0,0,0,0,0,B,B,B,0,0,0,0,0,0,B,B,B,B,B,B,0,0,B,0,0,0,
    0,0,0,0,0,B,0,0,0,0,0,0,0,0,0,0,B,B,B,B,0,0,B,0,0,0,
    W,W,0,0,0,B,0,0,A,0,0,0,A,0,0,0,B,B,B,0,0,0,0,0,0,0,
    W,W,0,0,0,B,0,0,A,0,0,0,A,0,0,0,B,B,B,0,0,0,0,0,0,0,
    0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,B,B,B,0,0,0,W,W,W,W,
    0,0,0,0,B,B,0,0,B,B,B,B,0,0,0,0,B,B,B,0,0,0,W,W,W,W,
    0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,0,0,
    0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,0,0,
    0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,0,
    0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,0,
    0,0,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,
    0,0,0,0,0,0,B,B,B,B,B,B,B,B,B,B,B,B,0,0,0,0,0,0,0,0,
    0,0,B,B,B,B,0,0,B,B,B,B,B,B,B,B,0,0,B,B,B,B,0,0,T,T,
    0,0,B,B,B,B,B,B,0,0,B,B,B,B,0,0,B,B,B,B,B,B,0,0,T,T,
    T,T,0,0,B,B,B,B,0,0,0,0,0,0,0,0,B,B,B,B,0,0,T,T,T,T,
    T,T,0,0,0,0,0,0,0,0,0,B,B,B,B,0,0,0,0,0,0,0,T,T,T,T,
    A,A,T,T,0,0,0,0,0,0,0,B,0,0,B,0,0,0,0,0,T,T,T,T,A,A,
    A,A,T,T,0,0,0,0,0,0,0,B,0,0,B,0,0,0,0,0,T,T,T,T,A,A,
  ]
}