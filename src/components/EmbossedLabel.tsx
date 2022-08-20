import styled from 'styled-components'
import { Colors } from '../utils/theme'

interface Props {
  text: string;
  fontSize?: string;
}

export function EmbossedLabel ({
  text,
  fontSize = '13px'
}: Props) {
  return (
    <Text fontSize={fontSize}>
    {text}
    </Text>
  )
}

const Text = styled.span<{
  fontSize?: string;
}>`
  font-size: ${props => props.fontSize || '13px'};
  text-shadow: 0px 1px 1px #57524f;
  color: ${Colors.darkBorder};
  font-weight: 500;
  white-space: no-wrap;
`
