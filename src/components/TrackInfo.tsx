import styled from 'styled-components'
import { TuneMetaData } from './TuneTableRow'

export function TrackInfo ({ artist = 'N/A', title = 'N/A', duration, color, position }: TuneMetaData & {
  duration?: number;
  color: string;
  position: number;
}) {
  const durationString = getTimeAsString(duration)
  const positionString = getTimeAsString(position * (duration || 0))

  return (
    <Wrapper>
      <Body>
        <Row>
          <Cell opacity={0.6} color={color}>
            {'Artist:'}
          </Cell>
          <Cell bold width={'100%'}>
            {artist}
          </Cell>
          <Cell opacity={0.5} color={color}>
            {'Duration:'}
          </Cell>
          <Cell digital width={'100%'} fontSize={'14px'} textAlign={'right'}>
            {durationString}
          </Cell>
        </Row>
        <Row>
          <Cell opacity={0.6} color={color}>
            {'Title:'}
          </Cell>
          <Cell bold width={'100%'}>
            {title}
          </Cell>
          <Cell opacity={0.5} color={color}>
            {'Position:'}
          </Cell>
          <Cell digital width={'100%'} fontSize={'14px'} textAlign={'right'}>
            {positionString}
          </Cell>
        </Row>
      </Body>
    </Wrapper>
  )
}

const getTimeAsString = (duration: number | undefined): string => {
  if (!duration) return '0:00'
  const minutes = Math.floor(duration / 60)
  const seconds = Math.round(duration % 60)
  const leadingZeroSeconds = seconds < 10 ? `0${seconds}` : seconds
  return `${minutes}:${leadingZeroSeconds}`
}

const Wrapper = styled.table`
  width: 100%;

  border-collapse: collapse;
  color: white;
  margin: 8px;
`

const Body = styled.tbody``

const Row = styled.tr``

const Cell = styled.td<{
  bold?: boolean;
  color?: string;
  opacity?: number;
  textAlign?: string;
  monospace?: boolean;
  digital?: boolean;
  fontSize?: string;
}>`
  padding-right: 20px;
  font-size: ${({ fontSize }) => fontSize || '12px'};
  font-weight: 600;
  ${({ digital }) => digital && 'font-family: "Digital";'}
  color: ${({ color }) => color || 'white'};
  ${({ opacity }) => opacity && `opacity: ${opacity};`}
  ${({ monospace }) => monospace && 'font-family: monospace, monospace;'}
  ${({ textAlign }) => textAlign && `text-align: ${textAlign};`}
`
