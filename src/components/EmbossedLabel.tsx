import styled from 'styled-components'
import { Colors } from '../utils/theme'

interface Props {
  text: string;
}

export function EmbossedLabel ({
  text
}: Props) {
  return (
    <Text>
    {text}
    </Text>
  )
}

const Text = styled.span`
  font-size: 13px;
  text-shadow: 0px 1px 1px #57524f;
  color: ${Colors.darkBorder};
  font-weight: 500;
  white-space: no-wrap;
`
