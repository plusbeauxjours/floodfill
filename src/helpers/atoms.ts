import { atom } from 'recoil'

export interface ICanvasSize {
  width: number
  height: number
}

export const _canvasSizeVar = atom<ICanvasSize>({
  key: 'canvasSizeVar',
  default: {
    width: 0,
    height: 0,
  },

  
})

export const _base64Var = atom<string>({
  key: 'base64Var',
  default: "",
})
