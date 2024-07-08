import React, { useState, useEffect, useRef } from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import axios from 'axios'

import {
  ICanvasSize,
  IModalType,
  INativeNft,
  INft,
  _base64Var,
  _canvasSizeVar,
  _modalVar,
  _promptVar,
  _selectNativeNftFn,
  _selectNftFn,
  _selectedImageIndexVar,
  _walletAccountVar,
} from '@/helpers/atoms'
import { getUploadImageInfo, resizeImage, scrollToTop } from '@/helpers/utils'
import { defaultImageType, navbarMaxBarWidth } from '@/helpers/constants'
import { useInpaint } from '@/helpers/hooks/useInpaint'
import { CHAIN, MODAL_TYPE } from '@/helpers/types'

import { canvasHandler } from '@/handlers/canvasHandler'
import { DrawingComponent } from '@/components/drawingComponent'
import ConnectWalletButton from '@/components/buttons/connectMenuButton'
import MaskingModeComponent from '@/components/maskingModeComponent'
import { SmallButton, Button, BorderButton, ButtonWithTooltip } from '@/components/buttons/button'

import { CloseIcon } from '@/styles/commonIcons'
import theme from '@/styles/theme'
import { Tooltip } from '@chakra-ui/react'

export interface IInputData {
  prompt: string
  image: any
  tokenId: string
}
interface IProps {}

export enum DrawingMode {
  pencil = 'PENCIL',
  eraser = 'ERASER',
  fill = 'FILL',
}

export const LineWidths = {
  xs: 10,
  sm: 20,
  md: 30,
  lg: 40,
  xl: 50,
}

export default function UploadComponent({}: IProps) {
  const blurOffset = 2
  const canvasRef = useRef(null)

  const [domLoaded, setDomLoaded] = useState(false)
  const [isMaskingMode, setIsMaskingMode] = useState<boolean>(false)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DrawingMode.pencil)
  const [isConvertingLoading, setIsConvertingLoading] = useState<boolean>(false)
  const [lineWidth, setLineWidth] = useState<number>(LineWidths.md)
  const [base64, setBase64] = useRecoilState<string>(_base64Var)
  const [blur, setBlur] = useState<number>(10)

  const setSelectedImageIndex = useSetRecoilState<number>(_selectedImageIndexVar)
  const [prompt, setPrompt] = useRecoilState<string>(_promptVar)
  const [canvasSize, setCanvasSize] = useRecoilState<ICanvasSize>(_canvasSizeVar)
  const [selectedNft, setSelectedNft] = useRecoilState<INft>(_selectNftFn)
  const [selectedNativeNft, setSelectedNativeNft] = useRecoilState<INativeNft>(_selectNativeNftFn)
  const setModal = useSetRecoilState<IModalType>(_modalVar)
  const walletAccount = useRecoilValue(_walletAccountVar)
  const [inpaintMutation, { data, isLoading }] = useInpaint()

  const deleteImage = () => {
    setPrompt('')
    setSelectedNft(null)
    setSelectedNativeNft(null)
    setBase64(null)
  }

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const toggleMaskingMode = () => {
    setDrawingMode(DrawingMode.pencil)
    canvasHandler.updateDrawingMode(DrawingMode.pencil)
      setIsMaskingMode(!isMaskingMode)
  }

  const onClickBtn = () => {
    setSelectedImageIndex(0)
    inpaintMutation(prompt)
  }

  const onImgLoad = ({ target }) => {
    const { width, height } = resizeImage(target.naturalWidth, target.naturalHeight)
    canvasHandler.setImageSize({ width, height })
    setCanvasSize({ width, height })
  }

  const handleResize = () => {
    const { uploadImageWidth, uploadImageHeight } = getUploadImageInfo()
    setCanvasSize({ width: uploadImageWidth, height: uploadImageHeight })
  }

  const getBase64 = async (url: string) => {
    const timer = setInterval(() => setBlur((prev) => prev > 2 && prev - blurOffset), 300)
    try {
      let image
      setIsConvertingLoading(true)

      if (walletAccount.chain === CHAIN.ETH) {
        const nftImage: any = await fetch(`/api/fetchImage/?url=${url}`)
        image = await nftImage.json()
      } else if (walletAccount.chain === CHAIN.AIN) {
        const { data } = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        image = data
      }

      let raw = Buffer.from(image).toString('base64')
      const base64Image = `data:${defaultImageType};base64,` + raw

      const resizedBase64 = await canvasHandler.resizeBase64Image(base64Image)
      if (typeof resizedBase64 === 'string') {
        setBase64(resizedBase64)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsConvertingLoading(false)
      clearInterval(timer)
    }
  }

  useEffect(() => {
    if (walletAccount.chain === CHAIN.ETH && selectedNft && !base64) {
      getBase64(selectedNft?.meta.content[0].url)
    }
    if (walletAccount.chain === CHAIN.AIN && selectedNativeNft && !base64) {
      getBase64(
        selectedNativeNft?.metadata[Object.keys(selectedNativeNft?.metadata).length - 1].image,
      )
    }
  }, [selectedNft, selectedNativeNft])

  useEffect(() => {
    if (!isLoading && data) {
      scrollToTop()
    }
  }, [isLoading])

  useEffect(() => {
    setDomLoaded(true)
    window.addEventListener('resize', handleResize)
    return () => {
      setPrompt('')
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!domLoaded) return
  return (
    <Column>
      {!selectedNft && !selectedNativeNft && domLoaded ? (
        <EmptyImageBox>
              <EmptyImageText>Please choose the NFT that you want to customize.</EmptyImageText>
              <SmallButton
                onClick={() =>
                  setModal({
                    modalType: MODAL_TYPE.SELECT_NFT,
                    isVisible: true,
                    isSidebar: false,
                  })
                }
                text={'Choose Nft'}
                disabled={!walletAccount.active}
              />
        </EmptyImageBox>
      ) : (
        <ImageBox>
          {canvasSize && (
            <DrawingComponent
              canvasRef={canvasRef}
              isMaskingMode={isMaskingMode}
              drawingMode={drawingMode}
            />
          )}
          <Image
            alt={'uploadImage'}
            id="uploadImage"
            src={
              isConvertingLoading
                ? walletAccount.chain === CHAIN.ETH
                  ? selectedNft?.meta.content[0].url
                  : selectedNativeNft?.metadata[Object.keys(selectedNativeNft?.metadata).length - 1]
                      .image
                : base64
            }
            onLoad={onImgLoad}
          />
          {!isLoading &&
            (selectedNft || selectedNativeNft) &&
            !isMaskingMode &&
            !isConvertingLoading &&
            canvasSize && (
              <CloseBtn onClick={deleteImage}>
                <CloseIcon color={theme.colors.Neutral.White} />
              </CloseBtn>
            )}
        </ImageBox>
      )}
      {!isMaskingMode ? (
        <>
          <Input
            value={prompt}
            onChange={handlePromptChange}
            placeholder={'Describe what you want to generate on corresponding masking area.\nex) an ocean view, ... '}
            maxLength={309}
          />
          <Row>
            <BorderButton
              isLoading={isLoading || isConvertingLoading}
              disabled={(!selectedNft && !selectedNativeNft) || isLoading || isConvertingLoading}
              text={'Masking Mode'}
              onClick={toggleMaskingMode}
            />
            <HorizontalDivider />
            <ButtonWithTooltip
              isLoading={isLoading || isConvertingLoading}
              disabled={
                (!selectedNft && !selectedNativeNft) ||
                isLoading ||
                isConvertingLoading ||
                canvasHandler.stackStep === 0 ||
                !prompt
              }
              text={'Run!'}
              onClick={onClickBtn}
              tooltipText={'Generate new image with given prompt and masked area.'}
              theme={theme}
            />
          </Row>
        </>
      ) : (
        <MaskingModeComponent
          toggleMaskingMode={toggleMaskingMode}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
        />
      )}
    </Column>
  )
}

const Column = styled.div`
  width: 100%;
  max-width: 700px;
  padding-top: 16px;
  @media screen and (min-width: ${navbarMaxBarWidth}px) {
    margin: 0 8px;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 64px;
  @media screen and (max-width: 310px) {
    flex-direction: column;
  }
`
const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
`
const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`
const Input = styled.textarea`
  display: flex;
  width: 100%;
  height: 106px;
  border-radius: 8px;
  margin-top: 16px;
  vertical-align: top;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.Neutral.Gray[0]};
  border: 1px solid ${(props) => props.theme.colors.Neutral.Gray[2]};
  color: ${(props) => props.theme.colors.Neutral.Gray[8]};
  font-weight: 500;
  line-height: 20px;
  font-size: 14px;
  &:focus {
    outline: none !important;
    border-color: ${(props) => props.theme.colors.Neutral.Violet[50]};
  }
  ::-webkit-input-placeholder {
    color: ${(props) => props.theme.colors.Neutral.Gray[5]};
  }
  :-moz-placeholder {
    color: ${(props) => props.theme.colors.Neutral.Gray[5]};
  }
  ::-moz-placeholder {
    color: ${(props) => props.theme.colors.Neutral.Gray[5]};
  }
  :-ms-input-placeholder {
    color: ${(props) => props.theme.colors.Neutral.Gray[5]};
  }
`
const CloseBtn = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  right: 16px;
  top: 16px;
  bottom: 0px;
  background-color: rgba(47, 51, 59, 0.5);
`
const EmptyImageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.Neutral.Gray[0]};
  border-radius: 8px;
  max-width: 700px;
  height: 700px;
  padding: 16px;
  @media screen and (max-width: 700px) {
    height: 100vw;
  }
`
const EmptyImageText = styled.p`
  font-family: Quicksand;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
  text-align: center;
  color: ${(props) => props.theme.colors.Neutral.Gray[6]};
`
const HorizontalDivider = styled.div`
  width: 16px;
`
