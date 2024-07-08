import MagicWand from 'magic-wand-tool'
import { DrawingMode, LineWidths } from '../components/uploadComponent'
import { colorRgba, defaultImageType } from '../constants'
import { getContext, getUploadImageInfo, resizeImage } from '../helpers/utils'

interface IImageInfo {
  width?: number
  height?: number
  bytes: number
  data: any
}

interface IBounds {
  maxX: number
  maxY: number
  minX: number
  minY: number
}

interface IMask {
  bounds: IBounds
  data: Uint8Array
  height: number
  width: number
}

class CanvasHandler {
  isPainting: boolean
  lastX: number
  lastY: number
  scaleX: number
  scaleY: number
  stack: string[]
  stackStep: number
  currentStack: string
  lineColor: string
  lineWidth: number
  drawingMode: DrawingMode
  imageInfo: IImageInfo

  blurRadius: number
  mask: IMask
  oldMask: IMask
  currentThreshold: number

  constructor() {
    this.isPainting = false
    this.stack = []
    this.stackStep = 0
    this.lineColor = `rgba(${colorRgba.join(',')})`
    this.lineWidth = 30
    this.imageInfo = {
      bytes: 0,
      data: null,
    }

    this.blurRadius = 5
    this.mask = null
    this.oldMask = null
    this.currentThreshold = 20
  }

  private updateLightMask(j: number, maskData: Uint8Array | Uint8ClampedArray) {
    maskData[j] = 1
    maskData[j + 1] = 1
    maskData[j + 2] = 1
    maskData[j + 3] = 1
  }

  private updateDarkMask(j: number, maskData: Uint8Array | Uint8ClampedArray) {
    maskData[j] = 0
    maskData[j + 1] = 0
    maskData[j + 2] = 0
    maskData[j + 3] = 0
  }

  private resetCanvasStyle() {
    const { canvas, ctx } = getContext()

    const rect = canvas.getBoundingClientRect()

    ctx.lineWidth = (this.imageInfo.width * LineWidths.md) / rect.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.strokeStyle = this.lineColor
    ctx.fillStyle = this.lineColor
  }

  private initStack() {
    this.stack = []
    this.stackStep = 0
    return
  }

  private getImageData() {
    const { ctx } = getContext()
    const imageData = ctx.getImageData(0, 0, +this.imageInfo.width, +this.imageInfo.height)
    return imageData
  }

  private updateStack() {
    let maskData: Uint8Array
    const { canvas } = getContext()
    const imageData = this.getImageData()
    const data = new Uint8Array(imageData.data)

    if (!this.mask) this.initMask()

    maskData = this.mask?.data
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a > 0) {
        let j = i / 4
        this.updateLightMask(j, maskData)
      } else {
        let j = i / 4
        this.updateDarkMask(j, maskData)
      }
    }

    const newStack = canvas.toDataURL()
    this.stack = this.stack.slice(0, this.stackStep).concat(newStack)
    this.stackStep++
    return
  }

  public initCanvas() {
    const { canvas } = getContext()

    canvas.width = this.imageInfo.width
    canvas.height = this.imageInfo.height

    this.resetCanvasStyle()

    this.isPainting = false
    this.drawingMode = DrawingMode.pencil
    this.stack = []
    this.stackStep = 0
    this.mask = null
    this.oldMask = null

    this.initStack()
  }

  public initMask() {
    this.setImageDataFromArray()
    this.mask = {
      data: new Uint8Array(this.imageInfo.width * this.imageInfo.height),
      width: this.imageInfo.width,
      height: this.imageInfo.height,
      bounds: {
        minX: 0,
        minY: 0,
        maxX: this.imageInfo.width - 1,
        maxY: this.imageInfo.height - 1,
      },
    }
  }

  private setImageDataFromArray() {
    this.imageInfo.data = new Uint8Array(this.imageInfo.width * this.imageInfo.height)
  }

  private setImageDataFromImage() {
    const { ctx } = getContext()
    const { uploadImage, uploadImageWidth, uploadImageHeight } = getUploadImageInfo()

    ctx.drawImage(uploadImage, 0, 0, uploadImageWidth, uploadImageHeight)
    this.imageInfo.data = this.getImageData()
  }

  public toggleMaskingMode() {
    this.resetCanvasStyle()
  }

  public setImageSize(imageSize: { width: number; height: number }) {
    const { canvas } = getContext()

    this.imageInfo = { ...this.imageInfo, ...imageSize }

    canvas.width = this.imageInfo.width
    canvas.height = this.imageInfo.height
  }

  public getImageSize() {
    const { width, height } = this.imageInfo
    return { width, height }
  }

  public getLineWidth() {
    return this.lineWidth
  }

  public resizeBase64Image(base64: string) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = function () {
        const { width, height } = resizeImage(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const resizedBase64 = canvas.toDataURL(defaultImageType)
        resolve(resizedBase64)
      }
      img.onerror = reject
      img.src = base64
      return base64
    })
  }

  public updateLineWidth(width: number) {
    const { canvas, ctx } = getContext()
    const rect = canvas.getBoundingClientRect()

    ctx.lineWidth = (this.imageInfo.width * width) / rect.width
    this.lineWidth = width
  }

  private redrawImage(stack: string) {
    const { ctx } = getContext()

    const { width, height } = this.imageInfo
    let img = new Image()
    img.src = stack
    img.onload = function () {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0)
    }
  }

  public undo() {
    const { canvas, ctx } = getContext()
    const isFirstStateStep = this.stackStep === 0
    const isLatestStackStep = this.stackStep === this.stack.length

    ctx.globalCompositeOperation = 'source-over'

    if (isLatestStackStep) {
      const newStack = canvas.toDataURL()
      this.currentStack = newStack
    }

    if (!isFirstStateStep) {
      this.stackStep--
      this.redrawImage(this.stack[this.stackStep])
    }
  }

  public redo() {
    const { ctx } = getContext()
    const isNotLatestStackStep = this.stackStep < this.stack.length - 1
    const isLatestStackStep = this.stackStep === this.stack.length - 1

    ctx.globalCompositeOperation = 'source-over'

    if (isNotLatestStackStep) {
      this.stackStep++
      this.redrawImage(this.stack[this.stackStep])
    } else if (isLatestStackStep) {
      this.stackStep++
      this.redrawImage(this.currentStack)
      this.currentStack = null
    }
  }

  public reset() {
    this.updateStack()

    const { canvas } = getContext()

    canvas.width = this.imageInfo.width
    canvas.height = this.imageInfo.height

    this.resetCanvasStyle()
    this.initStack()
  }

  public reverse() {
    this.updateStack()

    let maskData: Uint8Array

    const { ctx } = getContext()

    const imageData = this.getImageData()
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a > 0) {
        this.updateDarkMask(i, data)
      } else {
        data[i] = colorRgba[0]
        data[i + 1] = colorRgba[1]
        data[i + 2] = colorRgba[2]
        data[i + 3] = colorRgba[3]
      }
    }

    maskData = this.mask?.data
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a > 0) {
        let j = i / 4
        this.updateLightMask(j, maskData)
      } else if (a === 0) {
        let j = i / 4
        this.updateDarkMask(j, maskData)
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private updateLatestMousePosition(event: MouseEvent) {
    const { canvas } = getContext()

    const rect = canvas.getBoundingClientRect()
    this.scaleX = this.imageInfo.width / rect.width
    this.scaleY = this.imageInfo.height / rect.height

    this.lastX = (event.clientX - rect.left) * this.scaleX
    this.lastY = (event.clientY - rect.top) * this.scaleY
  }

  private updateLatestTouchPosition(event: TouchEvent) {
    const { canvas } = getContext()

    const rect = canvas.getBoundingClientRect()
    this.scaleX = this.imageInfo.width / rect.width
    this.scaleY = this.imageInfo.height / rect.height

    this.lastX = (event.touches[0].clientX - rect.left) * this.scaleX
    this.lastY = (event.touches[0].clientY - rect.top) * this.scaleY
  }

  public onMouseMove(event: MouseEvent) {
    const { ctx } = getContext()

    this.updateLatestMousePosition(event)

    if (this.isPainting) {
      ctx.lineTo(this.lastX, this.lastY)
      ctx.stroke()
      return
    }
    ctx.moveTo(this.lastX, this.lastY)
  }

  public onTouchMove(event: TouchEvent) {
    const { ctx } = getContext()

    event.preventDefault()
    this.updateLatestTouchPosition(event)

    if (this.isPainting) {
      ctx.lineTo(this.lastX, this.lastY)
      ctx.stroke()
      return
    }
    ctx.moveTo(this.lastX, this.lastY)
  }

  public startMouseDrawing(event: MouseEvent) {
    const { ctx } = getContext()

    if (this.drawingMode === DrawingMode.pencil) {
      ctx.globalCompositeOperation = 'source-over'
    } else if (this.drawingMode === DrawingMode.eraser) {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    this.isPainting = true
    this.updateStack()

    this.updateLatestMousePosition(event)

    if (!this.mask) this.initMask()

    ctx.lineTo(this.lastX, this.lastY)
    ctx.stroke()
  }

  public startTouchDrawing(event: TouchEvent) {
    const { ctx } = getContext()

    if (this.drawingMode === DrawingMode.pencil) {
      ctx.globalCompositeOperation = 'source-over'
    } else if (this.drawingMode === DrawingMode.eraser) {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    this.isPainting = true
    this.updateStack()

    this.updateLatestTouchPosition(event)

    if (!this.mask) this.initMask()

    ctx.lineTo(this.lastX, this.lastY)
    ctx.stroke()
  }

  public drawToMask() {
    let maskData
    const imageData = this.getImageData()
    const data = new Uint8Array(imageData.data)

    if (this.drawingMode === DrawingMode.pencil) {
      maskData = this.mask?.data
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3]
        if (a > 0) {
          let j = i / 4
          this.updateLightMask(j, maskData)
        }
      }
    } else if (this.drawingMode === DrawingMode.eraser) {
      maskData = this.mask?.data
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3]
        if (a === 0) {
          let j = i / 4
          this.updateDarkMask(j, maskData)
        }
      }
    }
  }

  public cancelDrawing() {
    const { ctx } = getContext()

    if (this.isPainting) {
      this.drawToMask()
    }

    this.isPainting = false
    ctx.beginPath()
  }

  public leaveDrawing() {
    const { ctx } = getContext()

    if (this.isPainting) {
      this.updateStack()
      this.drawToMask()
    }

    this.isPainting = false
    ctx.beginPath()
  }

  public updateDrawingMode(drawingMode: DrawingMode) {
    const { canvas, ctx } = getContext()
    const rect = canvas.getBoundingClientRect()

    if (drawingMode === DrawingMode.pencil) {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = this.lineColor
      ctx.lineWidth = (this.imageInfo.width * this.lineWidth) / rect.width
      this.drawingMode = DrawingMode.pencil
    } else if (drawingMode === DrawingMode.eraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = (this.imageInfo.width * this.lineWidth) / rect.width
      this.drawingMode = DrawingMode.eraser
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = 'transparent'
      this.drawingMode = DrawingMode.fill
    }
  }

  public paint() {
    const { ctx } = getContext()

    if (!this.mask) return

    let x: number,
      y: number,
      data: Uint8Array = this.mask.data,
      bounds: IBounds = this.mask.bounds,
      maskW: number = this.mask.width,
      w: number = this.imageInfo.width,
      h: number = this.imageInfo.height,
      imgData: ImageData = ctx.createImageData(+w, +h),
      res: Uint8ClampedArray = imgData.data

    for (y = bounds.minY; y <= bounds.maxY; y++) {
      for (x = bounds.minX; x <= bounds.maxX; x++) {
        if (data[y * maskW + x] === 0) {
          continue
        }
        const k = (y * w + x) * 4
        res[k] = colorRgba[0]
        res[k + 1] = colorRgba[1]
        res[k + 2] = colorRgba[2]
        res[k + 3] = colorRgba[3]
      }
    }

    ctx.putImageData(imgData, 0, 0)
  }

  private concatMasks(mask: IMask, old: IMask) {
    let data1: Uint8Array = old.data,
      data2: Uint8Array = mask.data,
      w1: number = old.width,
      w2: number = mask.width,
      b1: IBounds = old.bounds,
      b2: IBounds = mask.bounds,
      w: number = old.width, // size for new mask
      h: number = old.height,
      i: number,
      j: number,
      k: number,
      k1: number,
      k2: number,
      len: number

    const result = new Uint8Array(w * h)

    len = b1.maxX - b1.minX + 1
    i = b1.minY * w + b1.minX
    k1 = b1.minY * w1 + b1.minX
    k2 = b1.maxY * w1 + b1.minX + 1
    for (k = k1; k < k2; k += w1) {
      result.set(data1.subarray(k, k + len), i) // copy row
      i += w
    }

    len = b2.maxX - b2.minX + 1
    i = b2.minY * w + b2.minX
    k1 = b2.minY * w2 + b2.minX
    k2 = b2.maxY * w2 + b2.minX + 1
    for (k = k1; k < k2; k += w2) {
      for (j = 0; j < len; j++) {
        if (data2[k + j] === 1) {
          result[i + j] = 1
        }
      }
      i += w
    }

    return {
      data: result,
      width: w,
      height: h,
      bounds: this.mask.bounds,
    }
  }

  private drawMask(x: number, y: number) {
    if (!this.imageInfo) return
    this.updateStack()

    this.setImageDataFromImage()

    const image = {
      data: this.imageInfo.data.data,
      width: this.imageInfo.width,
      height: this.imageInfo.height,
      bytes: 4,
    }
    this.oldMask = this.mask

    const old = null
    const newMask = MagicWand.floodFill(image, x, y, this.currentThreshold, old, true)

    if (newMask) {
      this.mask = {
        ...newMask,
        bounds: {
          minX: 0,
          minY: 0,
          maxX: this.imageInfo.width - 1,
          maxY: this.imageInfo.height - 1,
        },
      }

      this.mask = MagicWand.gaussBlurOnlyBorder(this.mask, this.blurRadius, old)

      if (this.oldMask) {
        this.mask = this.concatMasks(this.mask, this.oldMask)
      }
    }

    this.paint()
  }

  public startMousePainting(e: MouseEvent) {
    if (e.button === 0) {
      this.drawMask(Math.round(this.lastX), Math.round(this.lastY))
    }
  }

  public endMousePainting() {}
}

export const canvasHandler = new CanvasHandler()
