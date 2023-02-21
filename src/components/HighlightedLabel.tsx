import styled from 'styled-components'
import { Colors } from '../utils/theme'

interface Props {
  text: string;
  color?: string;
  glowColor?: string;
  bold?: boolean;
}

export function HighlightedLabel ({ text, color = Colors.deckA, glowColor, bold }: Props) {
  return (
    <Wrapper color={color} glowColor={glowColor} bold={bold}>
      {text}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  glowColor?: string;
  color: string;
  bold?: boolean;
}>`
  font-weight: ${({bold})=>  bold ? 700 : 500};
  font-size: 12px;
  color: ${({ color }) => color};
  ${({ glowColor }) => glowColor && `
    text-shadow: 0 0 5px ${glowColor};
  `}
`
