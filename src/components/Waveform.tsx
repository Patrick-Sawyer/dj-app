import { RefObject, useRef, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS, PlaybackStates } from "../webaudio/deckWebAudio";
import { WaveFormData } from "./WaveformData";

interface Props {
  data?: number[];
  color: string;
  playbackState: PlaybackStates;
  duration?: number;
  deck: typeof DECKS.deckA;
  setPosition: (position: number) => void;
  position: number;
  cuePoint: null | number;
  zoomInParent: RefObject<{ value: number }>;
}

const ZOOM_CHANGE_AMOUNT = 1.5;
const MAX_ZOOM = 1;
const MIN_ZOOM = 300;
const OFFSET = 50;

// MOVE CALCULATION TO WEB AUDIO WORKLET
// MAKE AVERAGE USE LESS CALCULATIONS

export function Waveform({
  data,
  color,
  playbackState,
  deck,
  duration,
  setPosition,
  position,
  cuePoint,
  zoomInParent,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  const decreaseZoom = () => {
    const nextState = Math.round(zoom * ZOOM_CHANGE_AMOUNT);
    if (nextState <= MIN_ZOOM) {
      if (zoomInParent.current) {
        zoomInParent.current.value = nextState;
      }
      setZoom(nextState);
    }
  };

  const increaseZoom = () => {
    const nextState = Math.round(zoom / ZOOM_CHANGE_AMOUNT);
    if (nextState >= MAX_ZOOM) {
      if (zoomInParent.current) {
        zoomInParent.current.value = nextState;
      }
      setZoom(nextState);
    }
  };

  return (
    <Wrapper>
      <WaveformWrapper>
        <MiniButton
          disabled={zoom > 60}
          marginRight
          color={color}
          onClick={decreaseZoom}
        >
          {"-"}
        </MiniButton>
        <FullWaveform ref={ref}>
          <div
            style={{
              display: "inline-block",
              paddingLeft: `${OFFSET}px`,
            }}
          >
            <div
              style={{
                right: `${(position * 100).toFixed(3)}%`,
                position: "relative",
                borderLeft: `1px solid ${Colors.lightGrey}`,
                borderRight: `1px solid ${Colors.lightGrey}`,
                width: data?.length
                  ? data.length / (devicePixelRatio * zoom)
                  : 0,
              }}
            >
              <WaveFormData zoom={zoom} color={color} data={data} />

              {cuePoint !== null && (
                <CuePoint
                  style={{
                    left: `calc(${(cuePoint * 100).toFixed(3)}% - 5px)`,
                  }}
                />
              )}
            </div>
          </div>
          <Indicator />
        </FullWaveform>
        <MiniButton
          disabled={zoom === 1}
          onClick={increaseZoom}
          marginLeft
          color={color}
        >
          {"+"}
        </MiniButton>
      </WaveformWrapper>
    </Wrapper>
  );
}

const CuePoint = styled.div`
  position: absolute;
  bottom: 2px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid white;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
`;

const WaveformWrapper = styled.div`
  width: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullWaveform = styled.div`
  width: 100%;
  height: 50px;
  overflow: hidden;
  background-color: ${Colors.darkGreyBackground};
  box-shadow: inset 0 0 20px -2px rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  box-sizing: border-box;
  position: relative;
`;

const Indicator = styled.div`
  height: 60px;
  width: 1px;
  position: absolute;
  top: 0px;
  left: ${OFFSET}px;
  background-color: white;
`;

export const MiniButton = styled.span<{
  marginLeft?: boolean;
  marginRight?: boolean;
  color: string;
  disabled?: boolean;
}>`
  line-height: 60px;
  color: ${({ color }) => color};
  font-weight: 300;
  font-size: 25px;
  opacity: 0.4;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  ${({ marginLeft }) => marginLeft && "margin-left: 15px;"}
  ${({ marginRight }) => marginRight && "margin-right: 15px;"}

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        opacity: 1;
      }

      &:active {
        opacity: 0.4;
      }
  `}

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;
