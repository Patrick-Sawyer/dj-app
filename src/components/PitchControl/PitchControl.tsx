import { memo, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { debouncer } from "../../utils/debouncer";
import { Colors } from "../../utils/theme";
import { DECKS } from "../../webaudio/deckWebAudio";
import { CONTEXT } from "../../webaudio/webAudio";
import { PitchBackground } from "./PitchBackground";
import { PitchSlider } from "./PitchSlider";

interface Props {
  deck: typeof DECKS.deckA;
  setPitch: (pitch: number) => void;
  sensitivity: number;
  reverse?: boolean;
  color: string;
}

const HEIGHT = CONTEXT.destination.maxChannelCount >= 4 ? 550 : 520;

interface SideProps {
  handleTrackClick: (value: boolean) => void;
  reverse: boolean;
  color: string;
  lightOn: boolean;
}

function SideComponent({
  handleTrackClick,
  reverse,
  color,
  lightOn,
}: SideProps) {
  return (
    <PlusMinus height={HEIGHT} reverse={!!reverse}>
      <Text
        onPointerDown={(e) => {
          handleTrackClick(true);
        }}
      >
        {"-"}
      </Text>
      <VerticalLine />
      <Light reverse={reverse} color={color} lightOn={lightOn} />
      <VerticalLine />
      <Text
        onPointerDown={(e) => {
          handleTrackClick(false);
        }}
      >
        {"+"}
      </Text>
    </PlusMinus>
  );
}

const Side = memo(SideComponent);

export function PitchControl({
  deck,
  setPitch,
  sensitivity,
  reverse,
  color,
}: Props) {
  const [offset, setOffset] = useState<number>(0);
  const [lightOn, setLightOn] = useState(true);

  const mouseState = useRef({
    mouseDown: false,
    startPosition: 0,
    offsetAtStart: 0,
  });

  const handleMouseDown = (e: any) => {
    mouseState.current.mouseDown = true;
    mouseState.current.startPosition = e.pageY;
    mouseState.current.offsetAtStart = offset;
  };

  const handleMouseUp = (e: any) => {
    mouseState.current.mouseDown = false;
    mouseState.current.startPosition = e.pageY;
  };

  const handleMouseMove = debouncer((e: any) => {
    if (mouseState.current.mouseDown) {
      const SCROLL_LIMIT = HEIGHT / 2 - 47;
      const diff = e.pageY - mouseState.current.startPosition;
      const value = mouseState.current.offsetAtStart - diff;
      const limited =
        value >= SCROLL_LIMIT
          ? SCROLL_LIMIT
          : value <= -SCROLL_LIMIT
          ? -SCROLL_LIMIT
          : value;
      setOffset(limited);
    }
  }, 100);

  const reset = useCallback(() => {
    mouseState.current.startPosition = 0;
    mouseState.current.offsetAtStart = 0;
    setOffset(0);
  }, []);

  useEffect(() => {
    window.addEventListener("pointerup", handleMouseUp);
    return () => {
      window.removeEventListener("pointerup", handleMouseUp);
    };
  }, []);

  const handleTrackClick = useCallback(
    (isAbove: boolean) => {
      setOffset(isAbove ? offset + 1 : offset - 1 / devicePixelRatio);
    },
    [offset]
  );

  const debouncedSetPitch = useCallback(debouncer(setPitch, 500), []);

  useEffect(() => {
    const nextPitch = 1 - (offset * sensitivity) / (HEIGHT / 2 - 47);
    deck.setPlayBackSpeed(nextPitch);
    debouncedSetPitch(nextPitch);
    setLightOn(nextPitch === 1);
  }, [offset, sensitivity]);

  return (
    <Wrapper reverse={reverse}>
      <Side
        color={color}
        lightOn={lightOn}
        handleTrackClick={handleTrackClick}
        reverse={!!reverse}
      />
      <Inner height={HEIGHT} onPointerMove={handleMouseMove}>
        <PitchBackground
          onClick={handleTrackClick}
          height={HEIGHT}
          offset={offset}
        />
        <PitchSlider
          offset={0 - offset}
          onMouseDown={handleMouseDown}
          reset={reset}
        />
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  reverse?: boolean;
}>`
  align-items: center;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid ${Colors.darkBorder};
  box-sizing: border-box;
  padding: 0 7px;
  ${({ reverse }) =>
    reverse
      ? `
    flex-direction: row-reverse;
    border-right: 1px solid ${Colors.darkBorder};
  `
      : `border-left: 1px solid ${Colors.darkBorder};`}

  @media screen and (max-width: 1100px) {
    padding-left: 5px;
    padding-right: 5px;
  }

  @media screen and (max-width: 1000px) {
    > div {
    }
  }
`;

const Inner = styled.div<{
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 50px;
  justify-content: center;
  display: flex;
  align-items: center;
  position: relative;
`;

const Light = styled.div<{
  color: string;
  reverse?: boolean;
  lightOn: boolean;
}>`
  border: 1px solid rgba(0, 0, 0, 0.6);
  background-color: ${({ color }) => color};
  height: 8px;
  width: 8px;
  min-height: 8px;
  max-height: 8px;
  min-width: 8px;
  max-width: 8px;
  border-radius: 8px;
  margin-top: 25px;
  margin-bottom: 25px;
  box-shadow: 0px 0px 3px 0px ${({ color }) => color};
  opacity: ${({ lightOn }) => (lightOn ? "1" : "0.2")};
`;

const PlusMinus = styled.div<{
  reverse: boolean;
  height: number;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height - 80}px;

  @media screen and (max-width: 1100px) {
    display: none;
  }
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
