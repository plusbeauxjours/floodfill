import * as styledComponents from 'styled-components'

interface IPrimary {
  Base: string
}

interface INeutral {
  White: string
  Gray: { number: string }
  Blue: { number: string }
  Pink: { number: string }
}

interface IOverlay {
  Thin: string
  Light: string
  Dark: string
}

interface IColors {
  colors: IPrimary | INeutral | IOverlay
}

interface IThemeInterface {
  colors: IColors
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents 

export { css, createGlobalStyle, keyframes, ThemeProvider }
export default styled
