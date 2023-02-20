import { useEffect, useRef, useState, memo } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { debouncer } from "./Deck";

interface Props {
  size?: number;
  text?: string;
  color: string;
  onChange?: (nextValue: number) => void;
  glowColor?: string;
  setBypass?: (nextValue: boolean) => void;
  fromZero?: boolean;
  bypassValue?: number;
  doubleClickValue?: number;
  numberOfLights?: number;
  initValue?: number;
  debounceTime?: number;
}

interface LightProps {
  color: string;
  glowColor?: string;
  active: boolean;
  rotate: number;
}

const Light = memo(({ color, glowColor, active, rotate }: LightProps) => {
  return (
    <LightOuter rotate={rotate}>
      <LightInner active={active} color={color} glowColor={glowColor} />
    </LightOuter>
  );
}); // TODO: only when active props change

const isActive = (
  numberOfLights: number,
  index: number,
  percentage: number,
  fromZero: boolean
) => {
  const useIndex = fromZero || percentage > 0 ? index : numberOfLights - index;

  return (
    index === 0 ||
    useIndex <=
      Math.floor(
        (numberOfLights * (fromZero ? percentage + 50 : Math.abs(percentage))) /
          100
      )
  );
};

export function Knob({
  text,
  color,
  onChange,
  size = 30,
  glowColor,
  setBypass,
  fromZero = false,
  bypassValue = -50,
  doubleClickValue = 0,
  numberOfLights = 20,
  initValue,
  debounceTime,
}: Props) {
  const [percentage, setPercentage] = useState(
    initValue !== undefined ? initValue : fromZero ? -50 : 0
  );
  const mouseDown = useRef(false);
  const mouseStartPosition = useRef(0);
  const [bypassed, setBypassed] = useState(false);

  const Lights = new Array(numberOfLights).fill(null).map((_, index) => {
    let rotate = (index * 360) / numberOfLights;
    let active =
      !bypassed && isActive(numberOfLights, index, percentage, fromZero);

    if (fromZero) {
      rotate = rotate + 180;
    }

    return (
      <Light
        color={color}
        glowColor={glowColor}
        active={active}
        rotate={rotate}
        key={index}
      />
    );
  });

  const handleMouseDown = (e: any) => {
    mouseDown.current = true;
    const { pageY } = e;
    mouseStartPosition.current = pageY;
    document.body.style.cursor = "pointer";
  };

  useEffect(() => {
    !bypassed && onChange && onChange(percentage);

    const handleMouseMove = debouncer((e: any) => {
      if (mouseDown.current) {
        const { pageY } = e;
        const diff = (mouseStartPosition.current - pageY) / 3;
        const nextValue =
          (diff > 10 ? 10 : diff < -10 ? -10 : diff) + percentage;
        setPercentage(nextValue > 50 ? 50 : nextValue < -50 ? -50 : nextValue);
        mouseStartPosition.current = pageY;
      }
    }, debounceTime);

    const handleMouseUp = (e: any) => {
      document.body.style.cursor = "auto";
      mouseDown.current = false;
      const { pageY } = e;
      mouseStartPosition.current = pageY;
    };

    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("pointermove", handleMouseMove);
    return () => {
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("pointermove", handleMouseMove);
    };
  }, [bypassed, onChange, percentage, mouseDown.current]);

  useEffect(() => {
    setBypass && setBypass(bypassed);
    onChange && onChange(bypassed ? bypassValue : percentage);
  }, [bypassed, onChange, percentage, setBypass]);

  return (
    <Wrapper>
      <KnobWrapper
        size={size}
        onPointerDown={handleMouseDown}
        onDoubleClick={() => {
          setPercentage(doubleClickValue);
        }}
      >
        {Lights}
        <Inner size={size}>
          <DotWrapper
            style={{
              transform: `rotate(${percentage / 100}turn)`,
            }}
          >
            <Dot color={bypassed ? Colors.darkGreyBackground : color} />
          </DotWrapper>
        </Inner>
      </KnobWrapper>
      {text && (
        <KnobText
          color={color}
          bypassed={bypassed}
          onMouseDown={() => {
            setBypassed(!bypassed);
          }}
          glowColor={glowColor}
        >
          {text}
        </KnobText>
      )}
    </Wrapper>
  );
}

const LightInner = styled.div<{
  color: string;
  glowColor?: string;
  active: boolean;
}>`
  background-color: ${({ color }) => color};
  height: 4px;
  width: 4px;
  border-radius: 2px;
  position: relative;
  top: 3.5px;
  box-shadow: 0px 0px 2px 1px ${({ glowColor }) => glowColor};

  ${({ active }) => !active && `opacity: 0;`}
`;

const LightOuter = styled.div<{
  rotate?: number;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  ${({ rotate }) =>
    !!rotate &&
    `
    transform: rotate(${rotate}deg);
  `}
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
  font-weight: 500;
  ${({ glowColor, bypassed }) =>
    glowColor && !bypassed && `text-shadow: 0 0 5px ${glowColor};`}
  cursor: pointer;
  color: ${({ color, bypassed }) =>
    bypassed ? Colors.darkGreyBackground : color};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  touch-action: none;
  position: relative;
`;

const KnobWrapper = styled.div<{
  size: number;
}>`
  position: relative;
  height: ${({ size }) => size + 20}px;
  width: ${({ size }) => size + 20}px;
  border: 1px solid ${Colors.darkBorder};
  border-radius: ${({ size }) => size / 2 + 10}px;
  overflow: hidden;
  background-color: ${Colors.darkGreyBackground};
  box-sizing: border-box;
`;

const Inner = styled.div<{
  size: number;
}>`
  height: ${({ size }) => size - 3}px;
  width: ${({ size }) => size - 3}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${Colors.knobBackground};
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

const DotWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
