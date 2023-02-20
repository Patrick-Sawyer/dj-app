import styled from "styled-components";
import { PlaybackStates } from "../../webaudio/deckWebAudio";
import { Notches } from "./Notches";
import { Colors } from "../../utils/theme";
import {
  PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { debouncer } from "../Deck";
import { AnimatedImage } from "./AnimatedImage";

interface Props {
  playbackState: PlaybackStates;
  loadingColor: string;
  imageUrl?: string;
  onChange: (value: number) => void;
}

interface Coord {
  pageX: number;
  pageY: number;
}

const limitAngle = (angle: number) => {
  if (angle > 0.5) return angle - 1;
  if (angle < -0.5) return angle + 1;
  return angle;
};

const calculateAngle = (coord1: Coord, coord2: Coord) => {
  const angle =
    Math.atan2(coord2.pageY - coord1.pageY, coord2.pageX - coord1.pageX) /
    (2 * Math.PI);

  return limitAngle(angle);
};

export function Wheel({
  playbackState,
  loadingColor,
  imageUrl,
  onChange,
}: Props) {
  const [rotate, setRotate] = useState(0);
  const initAngle = useRef<number>();
  const rotateAtStart = useRef<number>(0);
  const currentRotate = useRef<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  const getCentre = (): Coord | undefined => {
    if (ref.current) {
      const { top, height, left, width } = ref.current.getBoundingClientRect();

      return {
        pageX: left + width / 2 + window.scrollX,
        pageY: top + height / 2 + window.scrollY,
      };
    }
  };

  const onPointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      rotateAtStart.current = currentRotate.current;
      const { pageX, pageY } = e;
      const initCoord = { pageX, pageY };
      const centre = getCentre();
      if (!centre) return;
      initAngle.current = calculateAngle(initCoord, centre);
    },
    []
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    initAngle.current = undefined;
  }, []);

  const onPointerMove = useCallback(
    debouncer((e: PointerEvent) => {
      if (initAngle.current) {
        const currentCoord = {
          pageX: e.pageX,
          pageY: e.pageY,
        };
        const centre = getCentre();
        if (!centre) return;
        const currentAngle = calculateAngle(currentCoord, centre);
        const angleDiff = limitAngle(currentAngle - initAngle.current);
        onChange(angleDiff);
        const newRotateValue = limitAngle(rotateAtStart.current + angleDiff);
        setRotate(newRotateValue);
        currentRotate.current = newRotateValue;
      }
    }, 25),
    [initAngle.current]
  );

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <Wrapper ref={ref} onPointerDown={onPointerDown}>
      <Notches rotate={rotate} />
      <AnimatedImage
        playbackState={playbackState}
        loadingColor={loadingColor}
        imageUrl={imageUrl}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border: 1px solid ${Colors.darkBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px -100px 50px 12px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  position: relative;
  touch-action: none;
  box-sizing: border-box;
  cursor: pointer;
`;
