import {
  PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { debouncer } from "../../utils/debouncer";
import { Colors } from "../../utils/theme";
import { Lights } from "./Lights";

interface Props {
  size?: number;
  text?: string;
  color: string;
  onChange?: (nextValue: number) => void;
  glowColor: string;
  fromZero?: boolean;
  bypassValue?: number;
  doubleClickValue?: number;
  numberOfLights?: number;
  initValue?: number;
  debounceTime?: number;
}

interface State {
  mouseDownPosition?: number;
  percentageAtMouseDown?: number;
}

const limitValue = (value: number) => {
  if (value < -50) return -50;
  if (value > 50) return 50;
  return value;
};

export function NewKnob({
  text,
  color,
  onChange,
  size = 30,
  glowColor,
  fromZero = false,
  bypassValue = -50,
  doubleClickValue = 0,
  numberOfLights = 20,
  initValue,
  debounceTime = 100,
}: Props) {
  const state = useRef<State>({});
  const [bypassed, setBypassed] = useState(false);
  const [percentage, setPercentage] = useState(
    initValue !== undefined ? initValue : fromZero ? -50 : 0
  );

  const onPointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      state.current.mouseDownPosition = e.screenY;
      state.current.percentageAtMouseDown = percentage;
    },
    [percentage]
  );

  const onPointerUp = useCallback(() => {
    state.current.mouseDownPosition = undefined;
    state.current.percentageAtMouseDown = undefined;
  }, []);

  const onPointerMove = useCallback(
    debouncer((e: PointerEvent) => {
      if (
        state.current.mouseDownPosition !== undefined &&
        state.current.percentageAtMouseDown !== undefined
      ) {
        const changeThisTouch = state.current.mouseDownPosition - e.screenY;
        const newValue = state.current.percentageAtMouseDown + changeThisTouch;
        const limited = limitValue(newValue);
        if (percentage !== limited) {
          setPercentage(limited);
        }
      }
    }, 25),
    []
  );

  const reset = useCallback(() => {
    setPercentage(doubleClickValue);
  }, [doubleClickValue]);

  const handleBypass = useCallback(() => {
    const nextState = !bypassed;
    setBypassed(nextState);
    onChange && onChange(nextState ? bypassValue : percentage);
  }, [bypassed, percentage]);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const handleOnChange =
    !!onChange && useCallback(debouncer(onChange, debounceTime), []);

  useEffect(() => {
    !bypassed && handleOnChange && handleOnChange(percentage);
  }, [percentage, bypassed]);

  return (
    <Wrapper>
      <KnobWrapper size={size}>
        <Lights
          numberOfLights={numberOfLights}
          fromZero={fromZero}
          percentage={percentage}
          color={color}
          glowColor={glowColor}
        />
        <Control
          size={size}
          onPointerDown={onPointerDown}
          onDoubleClick={reset}
        >
          <DotRotate
            style={{
              transform: `rotate(${percentage / 100}turn)`,
            }}
          >
            <Dot />
          </DotRotate>
        </Control>
      </KnobWrapper>
      <KnobText
        color={bypassed ? undefined : color}
        glowColor={bypassed ? undefined : glowColor}
        onClick={handleBypass}
      >
        {text}
      </KnobText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  touch-action: none;
  position: relative;
  z-index: 50;
`;

const KnobWrapper = styled.div<{
  size: number;
}>`
  position: relative;
  height: ${({ size }) => size + 20}px;
  width: ${({ size }) => size + 20}px;
  border: 1px solid #151515;
  border-radius: ${({ size }) => size / 2 + 10}px;
  overflow: hidden;
  background-color: ${Colors.darkGreyBackground};
  box-sizing: border-box;
`;

const Control = styled.div<{
  size: number;
}>`
  height: ${({ size }) => size - 3}px;
  width: ${({ size }) => size - 3}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: #353535;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  border: 1px solid ${Colors.darkBorder};
  box-sizing: border-box;
  box-shadow: inset 0px -6px 11px -2px ${Colors.dirtyBrown};
`;

const Dot = styled.div`
  height: 4px;
  width: 4px;
  background-color: black;
  opacity: 0.7;
  border-radius: 2px;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
`;

const DotRotate = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const KnobText = styled.span<{
  glowColor?: string;
  bypassed?: boolean;
  color?: string;
  fontSize?: string;
}>`
  font-size: ${(props) => props.fontSize || "10px"};
  text-transform: uppercase;
  margin-top: 8px;
  letter-spacing: 1px;
  font-weight: 600;
  ${({ glowColor, bypassed }) =>
    glowColor && !bypassed && `text-shadow: 0 0 5px ${glowColor};`}
  cursor: pointer;
  color: ${({ color, bypassed }) =>
    bypassed ? Colors.darkGreyBackground : color};
`;
