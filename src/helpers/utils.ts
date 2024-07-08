import { defaultImageType, MAX_HEIGHT, MAX_WIDTH } from "../constants"

export const getContext = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  return { canvas, ctx }
}

export const resizeImage = (w: number, h: number) => {
  let width: number = w
  let height: number = h

  if (w > MAX_WIDTH) {
    const tempHeight = (height *= MAX_WIDTH / w)
    height = tempHeight - (tempHeight % 8)
    width = MAX_WIDTH
  } else if (h > MAX_HEIGHT) {
    const tempWidth = (width *= MAX_HEIGHT / h)
    width = tempWidth - (tempWidth % 8)
    height = MAX_HEIGHT
  } else {
    width = w - (w % 8)
    height = h - (h % 8)
  }

  return { width, height }
}

export const resizeMintImage = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = function () {
        const { width, height } = resizeImage(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        const resizedBase64 = canvas.toDataURL(defaultImageType)
        resolve(resizedBase64)
      }
      img.onerror = reject
      img.src = reader.result as any
      return file
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

export const generateUUID = () => {
  let date = new Date().getTime()

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

  return uuid
}

export const getUploadImageInfo = () => {
  const uploadImage = document.getElementById('uploadImage') as HTMLImageElement
  const { width, height } = resizeImage(uploadImage?.naturalWidth, uploadImage?.naturalHeight)
  const { width: clientWidth, height: clientHeight } = resizeImage(
    uploadImage?.width,
    uploadImage?.height,
  )
  return {
    uploadImage,
    uploadImageWidth: width,
    uploadImageHeight: height,
    clientWidth,
    clientHeight,
  }
}