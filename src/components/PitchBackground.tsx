import styled from "styled-components";

interface Props {
  height: number;
  onClick: (isAbove: boolean) => void;
  offset: number;
}

export function PitchBackground({ height, onClick, offset }: Props) {
  return (
    <Wrapper
      height={height}
      onPointerDown={(e) => {
        onClick(height / 2 - e.clientY - offset > 0);
      }}
    >
      <Markers height={height}>
        <Marker zIndex={3} opacity={0.85} />
        <Marker width={"75%"} />
        <Marker opacity={0.85} />
        <Marker width={"75%"} />
        <Marker opacity={0.85} />
        <Marker width={"75%"} />
        <Marker opacity={0.85} />
        <Marker width={"75%"} />
        <Marker opacity={1} width={"118%"} />
        <Marker width={"75%"} />
        <Marker opacity={0.85} />
        <Marker width={"75%"} />
        <Marker opacity={0.85} />
        <Marker width={"75%"} />
        <Marker opacity={0.85} />
        <Marker width={"75%"} />
        <Marker zIndex={3} opacity={0.85} />
      </Markers>
      <Track height={height} />
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  zIndex?: number;
  height: number;
}>`
  height: ${({ height }) => height - 30}px;
  width: 60%;
  position: absolute;
  z-index: 1;
  top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Track = styled.div<{
  height: number;
}>`
  height: ${({ height }) => height - 95}px;
  position: relative;
  bottom: 8px;
  width: 9px;
  background-color: black;
  z-index: 2;
  border-left: ${1 / devicePixelRatio}px solid rgba(255, 255, 255, 0.4);
  border-right: ${1 / devicePixelRatio}px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
`;

const Markers = styled.div<{
  height: number;
}>`
  height: ${({ height }) => height - 92}px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 23px;
  z-index: 0;
  cursor: pointer;
`;

const Marker = styled.div<{
  width?: string;
  opacity?: number;
  zIndex?: number;
}>`
  height: 1px;
  border-radius: 2px;
  background-color: white;
  opacity: ${({ opacity }) => opacity || 0.4};
  z-index: ${({ zIndex }) => zIndex || 1};
  width: ${({ width }) => width || "90%"};
`;
