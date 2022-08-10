import styled from 'styled-components'

interface Props {
  offset: number;
  onClick: (above: boolean) => void
}

export function PitchBackground ({
  offset,
  onClick
}: Props) {
  return (
    <Wrapper onPointerDown={(e) => {
      onClick((270 - e.clientY - offset) > 0)
    }}>
      <Markers >
        <Marker zIndex={3} opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker opacity={0.85} />
        <Marker small />
        <Marker zIndex={3} opacity={0.85} />
      </Markers>
      <Track />
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  zIndex?: number;
}>`
  height: 520px;
  width: 100%;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Track = styled.div`
  height: 87.5%;
  position: relative;
  bottom: 8px;
  width: 12px;
  background-color: black;
  z-index: 2;
  border-left: ${1 / devicePixelRatio}px solid rgba(255, 255, 255, 0.4);
  border-right: ${1 / devicePixelRatio}px solid rgba(255, 255, 255, 0.4);

`

const Markers = styled.div`
  height: 100%;
  width: 100%;
  height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 23px;
  z-index: 0;
`

const Marker = styled.div<{
  small?: boolean;
  opacity?: number;
  zIndex?: number;
}>`
  height: 1px;
  border-radius: 2px;
  width: 90%;
  background-color:white;
  opacity:${({ opacity }) => opacity || 0.5};
  z-index: ${({ zIndex }) => zIndex || 1};

  ${({ small }) => small && `
    width: 60%;
  `}
`
