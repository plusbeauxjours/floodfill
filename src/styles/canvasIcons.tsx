import React from 'react'
import styled from 'styled-components'
import theme from './theme'

export const PencilIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.832 18.5752L5.4064 13.1555L15.8667 2.70671C16.2574 2.3164 16.8909 2.3164 17.2817 2.70671L21.2923 6.71295C21.6831 7.10326 21.6831 7.73608 21.2923 8.12639L10.832 18.5752Z"
      fill={theme.colors.Neutral.Gray[6]}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.06878 20.6329C1.86615 21.1537 2.12667 21.7322 2.64771 21.9347C2.87928 22.0215 3.1398 22.0215 3.37138 21.9347L9.50808 19.6204L4.35556 14.5L2.06878 20.6329Z"
      fill={theme.colors.Neutral.Gray[6]}
    />
  </svg>
)

export const EraserIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_98_1866)">
      <path
        d="M14.8781 21.8429C15.1607 21.8429 15.4219 21.6921 15.5634 21.4474C15.7046 21.2026 15.7046 20.9011 15.5634 20.6562C15.4219 20.4114 15.1607 20.2606 14.8781 20.2606H4.03971C3.75698 20.2606 3.49595 20.4114 3.35449 20.6562C3.21322 20.9011 3.21322 21.2026 3.35449 21.4474C3.49595 21.6921 3.75697 21.8429 4.03971 21.8429H14.8781Z"
        fill={theme.colors.Neutral.Gray[6]}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8782 0.930798L20.1524 6.23135V6.2314C20.7482 6.82522 21.0832 7.63183 21.0832 8.47302C21.0832 9.31406 20.7482 10.1207 20.1524 10.7145L12.3993 18.4675C12.2533 18.6165 12.0542 18.7018 11.8456 18.7048L7.04614 18.652C6.83752 18.6491 6.63831 18.5639 6.49225 18.4147L1.77186 13.6943C1.22425 13.1498 0.916504 12.4094 0.916504 11.6374C0.916504 10.8651 1.22424 10.1249 1.77186 9.58045L10.3951 0.930798C10.989 0.334788 11.7953 0 12.6366 0C13.4778 0 14.2844 0.334816 14.8782 0.930798ZM7.38877 17.0697L11.5291 17.1225L13.6388 15.0128L6.09669 7.47073L2.87944 10.688C2.62983 10.9356 2.48947 11.2726 2.48947 11.6241C2.48947 11.9756 2.62982 12.3126 2.87944 12.5602L7.38877 17.0697Z"
        fill={theme.colors.Neutral.Gray[6]}
      />
    </g>
    <defs>
      <clipPath id="clip0_98_1866">
        <rect width="22" height="22" fill={theme.colors.Neutral.White} />
      </clipPath>
    </defs>
  </svg>
)

export const PaintIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.6312 26.05C27.1171 27.1368 26.0543 27.8729 24.8407 27.9828C24.6025 28.0057 24.3627 28.0057 24.1244 27.9828C22.9107 27.8729 21.8479 27.1368 21.3339 26.05C20.7751 24.901 20.8696 23.5479 21.5828 22.4849L23.7665 19.2762C23.9287 19.0387 24.2005 18.8964 24.4914 18.8964C24.7823 18.8964 25.0541 19.0387 25.2163 19.2762L27.3999 22.4849C28.1076 23.5511 28.1954 24.904 27.6315 26.05H27.6312Z"
      fill={theme.colors.Neutral.Gray[6]}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.4074 4C14.5696 4 13.7655 4.32828 13.1723 4.91343L4.92745 13.0466C4.33382 13.6319 4 14.4267 4 15.2558C4 16.0853 4.33385 16.8798 4.92745 17.4653L11.1113 23.5649C11.7045 24.1501 12.5086 24.4783 13.3462 24.4783C14.184 24.4783 14.9879 24.15 15.5813 23.5649L23.8261 15.4318C24.4197 14.8465 24.7536 14.0517 24.7536 13.2225C24.7536 12.3931 24.4197 11.5986 23.8261 11.0131L17.6423 4.91343C17.0491 4.32829 16.245 4 15.4074 4ZM14.5506 6.28238C14.7772 6.05887 15.0855 5.9327 15.4075 5.9327C15.7296 5.9327 16.0379 6.05887 16.2645 6.28238L22.4481 12.382C22.6746 12.6055 22.8014 12.9078 22.8014 13.2225C22.8014 13.5048 22.6993 13.7773 22.5145 13.9917H6.73528L14.5506 6.28238Z"
      fill={theme.colors.Neutral.Gray[6]}
    />
  </svg>
)

export const UndoIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.64706 1L1 5.70588L6.64706 10.4118"
      stroke={theme.colors.Neutral.Gray[6]}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.94141 5.70587H11.3532C14.472 5.70587 17.0002 8.23415 17.0002 11.3529V11.3529C17.0002 14.4717 14.472 17 11.3532 17H4.76494"
      stroke={theme.colors.Neutral.Gray[6]}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const RedoIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.3529 1L17 5.70588L11.3529 10.4118"
      stroke={theme.colors.Neutral.Gray[6]}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.0586 5.70587H6.64682C3.52804 5.70587 0.99977 8.23415 0.99977 11.3529V11.3529C0.99977 14.4717 3.52805 17 6.64683 17H13.2351"
      stroke={theme.colors.Neutral.Gray[6]}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const SizeIcon = ({ size }: any) => (
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    {(function () {
      switch (size) {
        case 'xs':
          return (
            <path
              d="M10 22L22 10"
              stroke={theme.colors.Neutral.Gray[3]}
              strokeWidth="6"
              strokeLinecap="round"
            />
          )
        case 'sm':
          return (
            <path
              d="M11 21L21 11"
              stroke={theme.colors.Neutral.Gray[3]}
              strokeWidth="10"
              strokeLinecap="round"
            />
          )
        case 'md':
          return (
            <path
              d="M12 20L20 12"
              stroke={theme.colors.Neutral.Gray[3]}
              strokeWidth="14"
              strokeLinecap="round"
            />
          )
        case 'lg':
          return (
            <path
              d="M13 19L19 13"
              stroke={theme.colors.Neutral.Gray[3]}
              strokeWidth="18"
              strokeLinecap="round"
            />
          )
        case 'xl':
          return (
            <circle
              cx="16"
              cy="16"
              r="13"
              transform="rotate(-90 16 16)"
              fill={theme.colors.Neutral.Gray[3]}
            />
          )
        default:
          return
      }
    })()}
  </svg>
)

export const VerticalDividerIcon = () => (
  <Margin>
    <svg width="2" height="26" viewBox="0 0 2 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1V25" stroke={theme.colors.Neutral.Gray[3]} strokeLinecap="round" />
    </svg>
  </Margin>
)

const Margin = styled.div`
  margin: 0 8px;
`
