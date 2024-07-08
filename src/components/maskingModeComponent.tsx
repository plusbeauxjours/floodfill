import  { Dispatch, SetStateAction } from 'react'

import styled from 'styled-components'
import { canvasHandler } from '../handlers/canvasHandler'
import { DrawingMode, LineWidths } from './uploadComponent'
import { EraserIcon, PaintIcon, PencilIcon, RedoIcon, SizeIcon, UndoIcon, VerticalDividerIcon } from '../styles/canvasIcons'
import { SmallBorderButton, SmallButton } from './buttons'

interface IProps {
  toggleMaskingMode: () => void
  drawingMode: DrawingMode
  setDrawingMode: Dispatch<SetStateAction<DrawingMode>>
  lineWidth: number
  setLineWidth: (lineWidth: number) => void
}
interface IStyle {
  isOpen?: boolean
  disabled?: boolean
  isSelected?: boolean
  isLastOption?: boolean
  isLoading?: boolean
}

export default function MaskingModeComponent({
  toggleMaskingMode,
  drawingMode,
  setDrawingMode,
  lineWidth,
  setLineWidth,
}: IProps) {
  const onClickResetBtn = () => {
    canvasHandler.reset()
  }

  const onClickRverseBtn = () => {
    canvasHandler.reverse()
  }

  const onChangeLineWidth = (width: number) => {
    setLineWidth(width)
    canvasHandler.updateLineWidth(width)
  }

  const onChangeDrawingTool = (tool: DrawingMode, width: number) => {
    setDrawingMode(tool)
    setLineWidth(width)
  }

  const onClickUndo = () => {
    canvasHandler.undo()
  }

  const onClickRedo = () => {
    canvasHandler.redo()
  }
  return (
    <MaskingModeContainer>
      <TopGroup>
        <TopGroupRowBox>
          <TopGroupRow>
            <SelectableIconBox
              onClick={() => {
                onChangeDrawingTool(
                  DrawingMode.pencil,
                  canvasHandler.getLineWidth(),
                )
              }}
              isSelected={drawingMode === DrawingMode.pencil}
              style={{ marginRight: 8 }}>
              <PencilIcon />
            </SelectableIconBox>
            <SelectableIconBox
              onClick={() => {
                onChangeDrawingTool(
                  DrawingMode.eraser,
                  canvasHandler.getLineWidth(),
                )
              }}
              isSelected={drawingMode === DrawingMode.eraser}>
              <EraserIcon />
            </SelectableIconBox>
          </TopGroupRow>
          <TopGroupRow style={{ flexWrap: 'nowrap' }}>
            {Object.keys(LineWidths).map((width, index) => (
              <PencilIconBox
                key={index}
                isSelected={lineWidth === LineWidths[width]}
                onClick={() => onChangeLineWidth(LineWidths[width])}
                style={{ marginLeft: index === 0 ? 8 : 0 }}>
                <SizeIcon size={width} />
              </PencilIconBox>
            ))}
          </TopGroupRow>
        </TopGroupRowBox>
        <TopGroupRow>
          <HideIconBox>
            <VerticalDividerIcon />
          </HideIconBox>
          <SelectableIconBox
            onClick={() => setDrawingMode(DrawingMode.fill)}
            isSelected={drawingMode === DrawingMode.fill}
            style={{ marginLeft: 8 }}>
            <PaintIcon />
          </SelectableIconBox>
          <VerticalDividerIcon />
          <IconTextBox onClick={onClickRverseBtn}>
            <IconText>Reverse</IconText>
          </IconTextBox>
        </TopGroupRow>
      </TopGroup>
      <BottomGroup>
        <BottomGroupRow>
          <IconBox onClick={onClickUndo}>
            <UndoIcon />
          </IconBox>
          <VerticalDividerIcon />
          <IconBox onClick={onClickRedo} style={{ marginLeft: 8 }}>
            <RedoIcon />
          </IconBox>
          <VerticalDividerIcon />
          <IconTextBox onClick={onClickResetBtn} style={{ marginLeft: 8 }}>
            <IconText>Reset</IconText>
          </IconTextBox>
        </BottomGroupRow>
        <BottomGroupRow>
          <SmallBorderButton
            disabled={false}
            text={'Cancel'}
            onClick={() => {
              toggleMaskingMode()
              canvasHandler.initCanvas()
            }}
          />
          <Void />
          <SmallButton
            disabled={false}
            text={'Ok'}
            onClick={toggleMaskingMode}
          />
        </BottomGroupRow>
      </BottomGroup>
    </MaskingModeContainer>
  )
}

const MaskingModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 450px;
`
const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin-right: 8px;
  &:hover {
    background-color: ${(props) => props.theme.colors.Neutral.Gray[2]};
  }
  &:active {
    opacity: 50%;
  }
`
const IconTextBox = styled(IconBox)<IStyle>`
  padding: 6px 8px;
  width: auto;
`
const SelectableIconBox = styled(IconBox)<IStyle>`
  background-color: ${(props) =>
    props.isSelected ? props.theme.colors.Neutral.Gray[8] : 'transparent'};
  path {
    fill: ${(props) =>
      props.isSelected
        ? props.theme.colors.Neutral.White
        : props.theme.colors.Neutral.Gray[6]};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.Neutral.Gray[8]};
    path {
      fill: ${(props) => props.theme.colors.Neutral.White};
    }
  }
  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? props.theme.colors.Neutral.Gray[8]
        : props.theme.colors.Neutral.Gray[2]};
    path {
      fill: ${(props) => props.theme.colors.Neutral.White};
    }
  }
`
const PencilIconBox = styled(IconBox)<IStyle>`
  path {
    stroke: ${(props) =>
      props.isSelected
        ? props.theme.colors.Neutral.Brush[100]
        : props.theme.colors.Neutral.Gray[3]};
  }
  circle {
    fill: ${(props) =>
      props.isSelected
        ? props.theme.colors.Neutral.Brush[100]
        : props.theme.colors.Neutral.Gray[3]};
  }
  &:active {
    opacity: 100%;
    path {
      stroke: ${(props) => props.theme.colors.Neutral.Brush[100]};
    }
    circle {
      fill: ${(props) => props.theme.colors.Neutral.Brush[100]};
    }
  }
  &:hover {
    background-color: transparent;
    path {
      stroke: ${(props) =>
        props.isSelected
          ? props.theme.colors.Neutral.Brush[100]
          : props.theme.colors.Neutral.Brush[50]};
    }
    circle {
      fill: ${(props) =>
        props.isSelected
          ? props.theme.colors.Neutral.Brush[100]
          : props.theme.colors.Neutral.Brush[50]};
    }
  }
`
const IconText = styled.p`
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.Neutral.Gray[6]};
`
const TopGroup = styled(Row)`
  width: 100%;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`
const TopGroupRow = styled(Row)`
  @media screen and (max-width: 500px) {
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
`
const TopGroupRowBox = styled(Row)`
  flex-direction: row;
  @media screen and (max-width: 325px) {
    flex-direction: column;
  }
`
const BottomGroup = styled(Row)`
  width: 100%;
  justify-content: space-between;
  margin-top: 24px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    justify-content: center;
  }
`
const BottomGroupRow = styled(Row)`
  @media screen and (max-width: 500px) {
    margin-bottom: 16px;
  }
`
const HideIconBox = styled.div`
  @media screen and (max-width: 500px) {
    display: none;
  }
`
const Void = styled.div`
  width: 8px;
`
