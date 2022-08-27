import styled from "styled-components";

interface Props {
  offset: number;
  onClick: (above: boolean) => void;
  reverse?: boolean;
  height: number;
}

export function PitchBackground({
  offset,
  onClick,
  reverse = false,
  height,
}: Props) {
  return (
    <Wrapper>
      <Markers
        onPointerDown={(e) => {
          onClick(270 - e.clientY - offset > 0);
        }}
      >
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
      <Track
        onPointerDown={(e) => {
          onClick(270 - e.clientY - offset > 0);
        }}
      />
      <PlusMinus reverse={reverse}>
        <Text
          onPointerDown={(e) => {
            onClick(true);
          }}
        >
          {"-"}
        </Text>
        <VerticalLine />
        <Gap />
        <VerticalLine />
        <Text
          onPointerDown={(e) => {
            onClick(false);
          }}
        >
          {"+"}
        </Text>
      </PlusMinus>
    </Wrapper>
  );
}

const Gap = styled.div`
  height: 230px;
  width: 1px;
`;

const PlusMinus = styled.div<{
  reverse: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 40px;
  height: 480px;

  @media screen and (max-width: 1100px) {
    display: none;
  }

  ${({ reverse }) => (reverse ? "right: -29px" : "left: -29px;")}
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  opacity: 0.3;
  background-color: white;
`;
const Text = styled.div`
  color: white;
  font-weight: 100;
  font-size: 30px;
  line-height: 20px;
  padding-top: 20px;
  transition: 0.1s;
  padding-bottom: 20px;
  opacity: 0.6;
  cursor: pointer;

  &:hover {
    opacity: 1;
    font-weight: 200;
  }

  &:active {
    opacity: 0.3;
  }
`;
const Wrapper = styled.div<{
  zIndex?: number;
}>`
  height: 520px;
  width: 60%;
  position: absolute;
  z-index: 1;
  top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Track = styled.div`
  height: 87.5%;
  position: relative;
  bottom: 8px;
  width: 9px;
  background-color: black;
  z-index: 2;
  border-left: ${1 / devicePixelRatio}px solid rgba(255, 255, 255, 0.4);
  border-right: ${1 / devicePixelRatio}px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
`;

const Markers = styled.div`
  height: 100%;
  width: 100%;
  height: 458px;
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
