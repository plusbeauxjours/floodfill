import React, { useEffect } from 'react'

import styled from 'styled-components'
import { canvasHandler } from '../handlers/canvasHandler'
import { DrawingMode } from './uploadComponent'
import { getContext } from '../helpers/utils'


interface IProps {
  canvasRef: React.MutableRefObject<any>
  isMaskingMode: boolean
  drawingMode: DrawingMode
}

export const DrawingComponent = ({ canvasRef, isMaskingMode, drawingMode, ...props }: IProps) => {
  useEffect(() => {
    const { canvas } = getContext()
    canvasHandler.toggleMaskingMode()
    canvasHandler.updateDrawingMode(drawingMode)

    const onMouseMove = (event: MouseEvent) => {
      canvasHandler.onMouseMove(event)
    }
    const startMouseDrawing = (event: MouseEvent) => {
      canvasHandler.startMouseDrawing(event)
    }
    const startMousePainting = (event: MouseEvent) => {
      canvasHandler.startMousePainting(event)
    }
    const cancelDrawing = () => {
      canvasHandler.cancelDrawing()
    }
    const endMousePainting = () => {
      canvasHandler.endMousePainting()
    }
    const leaveDrawing = () => {
      canvasHandler.leaveDrawing()
    }
    const onTouchMove = (event: TouchEvent) => {
      canvasHandler.onTouchMove(event)
    }
    const startTouchDrawing = (event: TouchEvent) => {
      canvasHandler.startTouchDrawing(event)
    }

    if (isMaskingMode) {
      if (drawingMode === DrawingMode.fill) {
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mousedown', startMousePainting)
        canvas.addEventListener('mouseup', endMousePainting)
        canvas.addEventListener('mouseleave', leaveDrawing)

        canvas.addEventListener('touchmove', onTouchMove)
        canvas.addEventListener('touchstart', startMousePainting)
        canvas.addEventListener('touchend', endMousePainting)
      } else {
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mousedown', startMouseDrawing)
        canvas.addEventListener('mouseup', cancelDrawing)
        canvas.addEventListener('mouseleave', leaveDrawing)

        canvas.addEventListener('touchmove', onTouchMove)
        canvas.addEventListener('touchstart', startTouchDrawing)
        canvas.addEventListener('touchend', cancelDrawing)
      }
    }

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', startMousePainting)
      canvas.removeEventListener('mousedown', startMouseDrawing)
      canvas.removeEventListener('mouseup', endMousePainting)
      canvas.removeEventListener('mouseup', cancelDrawing)
      canvas.removeEventListener('mouseleave', cancelDrawing)

      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchstart', startMousePainting)
      canvas.removeEventListener('touchstart', startTouchDrawing)
      canvas.removeEventListener('touchend', endMousePainting)
      canvas.removeEventListener('touchend', cancelDrawing)
    }
  }, [drawingMode, isMaskingMode])

  useEffect(() => {
    canvasHandler.initCanvas()
  }, [canvasRef])

  return <Canvas ref={canvasRef} id={'canvas'} {...props} style={{ opacity: '50%' }} />
}

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
`
