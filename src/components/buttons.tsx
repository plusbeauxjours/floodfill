import styled from "styled-components";

export const SmallBorderButton = ({
  disabled = false,
  isLoading = false,
  text = "",
  onClick = () => {},
  ...props
}) => (
  <SmallBorderButtonContainer
    disabled={disabled}
    onClick={() => !disabled && onClick()}
    isLoading={isLoading}
    {...props}>
    <SmallBorderButtonText disabled={disabled}>{text}</SmallBorderButtonText>
  </SmallBorderButtonContainer>
);

export const SmallButton = ({
  disabled = false,
  isLoading = false,
  text = "",
  onClick = () => {},
  ...props
}) => (
  <SmallButtonContainer
    disabled={disabled}
    onClick={() => !disabled && onClick()}
    isLoading={isLoading}
    {...props}>
    <SmallButtonText disabled={disabled}>{text}</SmallButtonText>
  </SmallButtonContainer>
);

interface IStyle {
  isOpen?: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  isLastOption?: boolean;
  isLoading?: boolean;
  text?: string;
}

const SmallButtonText = styled.p<IStyle>`
  font-family: "Quicksand";
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => props.theme.colors.Neutral.White};
`;
const SmallButtonContainer = styled.div<IStyle>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  min-height: 32px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: ${(props) => (props.isLoading || props.disabled ? "disabled" : "pointer")};
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.Neutral.Gray[4] : props.theme.colors.Neutral.Violet[50]};
  &:hover {
    background-color: ${(props) => !props.disabled && props.theme.colors.Neutral.Violet[60]};
  }
  &:active {
    opacity: 50%;
  }
`;
const SmallBorderButtonContainer = styled(SmallButtonContainer)`
  background-color: ${(props) => props.theme.colors.Neutral.White};
  border: ${(props) =>
    props.disabled
      ? `1px solid ${props.theme.colors.Neutral.Gray[4]}`
      : `1px solid ${props.theme.colors.Neutral.Violet[50]}`};
  &:hover {
    background-color: ${(props) => !props.disabled && props.theme.colors.Neutral.Violet[20]};
  }
  &:active {
    opacity:${(props) => (props.disabled ? "100%" : "50%")}
`;
const SmallBorderButtonText = styled(SmallButtonText)<IStyle>`
  color: ${(props) =>
    props.disabled ? props.theme.colors.Neutral.Gray[4] : props.theme.colors.Neutral.Violet[50]};
`;
