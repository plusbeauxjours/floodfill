import { useRecoilValue } from 'recoil'

import { defaultImageType } from '../constants'
import { getContext } from '../helpers/utils'
import { _base64Var } from '../helpers/atoms'
import { canvasHandler } from '../handlers/canvasHandler'

export function useInpaint() {
  const base64 = useRecoilValue<string>(_base64Var)

  const getMaskBinary = async (): Promise<File | undefined> => {
    const createMaskImg = (): string | undefined => {
      const { ctx } = getContext()
      const imageData = ctx?.getImageData(
        0,
        0,
        +canvasHandler.getImageSize().width,
        +canvasHandler.getImageSize().height,
      )
      if (imageData) {
        const getMaskCanvasFromImgCanvas = () => {
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3]
            if (a > 0) {
              data[i] = 255
              data[i + 1] = 255
              data[i + 2] = 255
              data[i + 3] = 255
            } else {
              data[i] = 0
              data[i + 1] = 0
              data[i + 2] = 0
              data[i + 3] = 255
            }
          }
        }

        const getMaskImgFromMaskanvas = (): string => {
          const tc = document.createElement('canvas')
          tc.width = canvasHandler.getImageSize().width
          tc.height = canvasHandler.getImageSize().height
          const tctx = tc.getContext('2d')
          tctx?.putImageData(imageData, 0, 0)

          return tc.toDataURL(defaultImageType)
        }

        getMaskCanvasFromImgCanvas()
        const maskImage = getMaskImgFromMaskanvas()

        return maskImage
      }
    }

    const maskImgUrl = createMaskImg()
    if (!maskImgUrl) throw new Error("Mask image creation failed")

    const maskImg = await fetch(maskImgUrl)
    if (!maskImg.ok) throw new Error("Mask image fetch failed")

    const blob: Blob = await maskImg.blob()
    const maskBinary = new File([blob], `maskBinary.png`, { type: 'image/png' })
    return maskBinary
  }

  const getNftBinary = async (): Promise<File> => {
    const nftImage = await fetch(base64)
    if (!nftImage.ok) throw new Error("NFT image fetch failed")

    const blob: Blob = await nftImage.blob()
    const nftBinary = new File([blob], `nftImage.png`, { type: 'image/png' })

    return nftBinary
  }

  return {
    getMaskBinary,
    getNftBinary
  }
}
