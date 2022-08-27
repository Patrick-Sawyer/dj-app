import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { PlaybackStates } from "../webaudio/deckWebAudio";
import * as musicMetadata from "music-metadata-browser";

interface NotchProps {
  rotate: number;
}

const NOTCHES = [
  0, 0.083, 0.166, 0.25, 0.333, 0.416, 0.5, 0.583, 0.666, 0.75, 0.833, 0.916,
];

const getDiameter = (screenWidth: number) => {
  if (screenWidth > 1100) return 280;
  if (screenWidth > 900) return 240;
  return 200;
};

function Notch({ rotate }: NotchProps) {
  return (
    <NotchWrapper
      style={{
        transform: `rotate(${rotate}turn)`,
      }}
    >
      <NotchInner />
    </NotchWrapper>
  );
}

type Coord = {
  x: number;
  y: number;
};

const calculateAngle = (coord1: Coord, coord2: Coord) => {
  return Math.atan2(coord2.y - coord1.y, coord2.x - coord1.x) / (2 * Math.PI);
};

interface Props {
  playbackState: PlaybackStates;
  image?: musicMetadata.IPicture;
  pitch: number;
  pitchJog: (pitch: number) => void;
}

interface MouseState {
  pageX: number;
  pageY: number;
  isMouseDown: boolean;
  currentPosition: number;
  initPosition: number;
  lastEndPosition: number;
  numberOfCompleteRotations: number;
  center: {
    x: number;
    y: number;
  };
}

export function JogWheel({ playbackState, image, pitch, pitchJog }: Props) {
  const [imageUrl, setImageUrl] = useState<string>(
    "https://picsum.photos/200/300"
  );
  const [globalRotate, setGlobalRotate] = useState(0);
  const [diameter, setWheelDiameter] = useState(getDiameter(window.innerWidth));
  const ref = useRef<HTMLDivElement>(null);
  const mouseState = useRef<MouseState>({
    pageX: 0,
    pageY: 0,
    isMouseDown: false,
    initPosition: 0,
    numberOfCompleteRotations: 0,
    lastEndPosition: 0,
    currentPosition: 0,
    center: {
      x: 0,
      y: 0,
    },
  });

  const calcDistance = (pageX: number, pageY: number): number => {
    const { x, y } = mouseState.current.center;
    return Math.sqrt(Math.pow(pageX - x, 2) + Math.pow(pageY - y, 2));
  };

  const wheelPosition = ({ pageX, pageY }: MouseEvent) => {
    const distanceFromCenter = calcDistance(pageX, pageY);
    const isInJogWheel = distanceFromCenter <= diameter / 2;
    const isInInnerWheel = distanceFromCenter < (diameter * 0.75) / 2;
    const block = distanceFromCenter < 25;
    const isClickable = isInJogWheel && !isInInnerWheel;

    return {
      isInJogWheel,
      isClickable,
      block,
      distanceFromCenter,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { block, isClickable } = wheelPosition(e);
    if (ref.current) {
      ref.current.style.cursor = isClickable ? "pointer" : "default";
    }

    if (block) return;
    if (mouseState.current.isMouseDown) {
      const { pageX, pageY } = e;

      const angle = calculateAngle(
        { x: pageX, y: pageY },
        mouseState.current.center
      );
      const diff = mouseState.current.initPosition - angle;
      mouseState.current.currentPosition =
        diff + mouseState.current.lastEndPosition;
      const nextState = mouseState.current.lastEndPosition + diff;
      setGlobalRotate(nextState);
      pitchJog(angle);
    }
  };

  const handleMouseDown = (e: any) => {
    const { pageX, pageY } = e;
    const { isClickable } = wheelPosition(e);
    if (!isClickable) return;

    mouseState.current.pageX = pageX;
    mouseState.current.pageY = pageY;
    mouseState.current.isMouseDown = true;
    const angle = calculateAngle(
      { x: pageX, y: pageY },
      mouseState.current.center
    );
    mouseState.current.initPosition = angle;
  };

  const getCenter = () => {
    if (!ref.current) return;
    const rect = ref.current?.getBoundingClientRect();
    const top = rect.top + rect?.height / 2;
    const left = rect.left + rect?.width / 2;
    mouseState.current.center = {
      x: left,
      y: top,
    };
  };

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      mouseState.current.isMouseDown = false;
      mouseState.current.lastEndPosition = mouseState.current.currentPosition;
    };

    window.addEventListener("pointermove", handleMouseMove);
    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("resize", onResize);
    };
  }, [diameter]);

  const onResize = (e: any) => {
    const width = e.currentTarget?.innerWidth;
    const nextDiameter = getDiameter(width);
    setWheelDiameter(nextDiameter);
    getCenter();
  };

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(new Blob([image.data]));
      setImageUrl(url);
      return;
    }

    setImageUrl("https://picsum.photos/200/300");
  }, [image]);

  useLayoutEffect(() => {
    getCenter();
  }, [ref]);

  return (
    <Wrapper>
      <Outer diameter={diameter}>
        <Wheel onPointerDown={handleMouseDown} ref={ref}>
          {NOTCHES.map((notch, index) => (
            <Notch key={index} rotate={notch - globalRotate} />
          ))}
          <Animated animated={playbackState === PlaybackStates.PLAYING}>
            <Inner>
              <ImageWrapper>
                {playbackState !== PlaybackStates.EMPTY && (
                  <Image src={imageUrl} />
                )}
              </ImageWrapper>
            </Inner>
          </Animated>
        </Wheel>
      </Outer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  bottom: 5px;

  @media screen and (max-width: 900px) {
    bottom: 13px;
  }
`;

const Outer = styled.div<{
  diameter: number;
}>`
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${Colors.darkBorder};
`;

const Wheel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px -100px 50px 12px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  position: relative;
  touch-action: none;
`;

const Inner = styled.div`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation-name: animation;
  animation-duration: 20s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-play-state: running;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: initial;
  background-color: black;
  box-sizing: border-box;

  @keyframes animation {
    0% {
      border: 2px dotted ${Colors.deckA};
    }
    50% {
      border: 2px dotted ${Colors.deckB};
    }
    100% {
      border: 2px dotted ${Colors.deckA};
    }
  }
`;

const Animated = styled.div<{
  animated: boolean;
}>`
  height: 75%;
  width: 75%;
  z-index: 5;
  animation-name: spinning;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: ${({ animated }) => (animated ? "running" : "paused")};

  @keyframes spinning {
    0% {
      transform: rotate(0turn);
    }
    100% {
      transform: rotate(1turn);
    }
  }
`;

const NotchInner = styled.div`
  height: 19.5%;
  width: 19.5%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0px 0px 20px 5px rgba(255, 255, 255, 0.1);
  z-index: 1;
  position: relative;
  top: 5px;
`;

const NotchWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ImageWrapper = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
