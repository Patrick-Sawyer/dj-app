import styled from 'styled-components'
import { Colors } from '../utils/theme'

interface Props {
  text: string;
  color?: string;
  glowColor?: string;
}

export function HighlightedLabel ({ text, color = Colors.deckA, glowColor }: Props) {
  return (
    <Wrapper color={color} glowColor={glowColor}>
      {text}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  glowColor?: string;
  color: string;
}>`
  font-weight: 500;
  font-size: 12px;
  color: ${({ color }) => color};
  ${({ glowColor }) => glowColor && `
    text-shadow: 0 0 5px ${glowColor};
  `}
`
