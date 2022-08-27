import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";

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
}

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
}: Props) {
  const [percentage, setPercentage] = useState(fromZero ? -50 : 0);
  const mouseDown = useRef(false);
  const mouseStartPosition = useRef(0);
  const [bypassed, setBypassed] = useState(false);

  const handleMouseDown = (e: any) => {
    mouseDown.current = true;
    const { pageY } = e;
    mouseStartPosition.current = pageY;
    document.body.style.cursor = "pointer";
  };

  useEffect(() => {
    !bypassed && onChange && onChange(percentage);

    const handleMouseMove = (e: any) => {
      if (mouseDown.current) {
        const { pageY } = e;
        const diff = (mouseStartPosition.current - pageY) / 3;
        const nextValue =
          (diff > 10 ? 10 : diff < -10 ? -10 : diff) + percentage;
        setPercentage(nextValue > 50 ? 50 : nextValue < -50 ? -50 : nextValue);
        mouseStartPosition.current = pageY;
      }
    };

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
  }, [bypassed, onChange, percentage]);

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
        {!bypassed && (
          <Svg
            viewBox="0 0 20 20"
            flip={!fromZero && percentage < 0}
            fromZero={fromZero}
          >
            <defs>
              <mask id="circlemask">
                <rect fill="white" width="100%" height="100%" />
                <circle r="8.8" cx="10" cy="10" fill="black" />
              </mask>
            </defs>

            <g mask="url(#circlemask)">
              <circle cx="10" cy="10" r="10" fill={"transparent"} />
              <circle
                cx="10"
                cy="10"
                stroke={color}
                r="5"
                strokeWidth="10"
                transform={"rotate(-90) translate(-20)"}
                strokeDasharray={`calc(31.4 * ${Math.abs(
                  fromZero ? percentage + 50 : percentage
                )} / 100) 31.4`}
              />
            </g>
          </Svg>
        )}
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

const Svg = styled.svg<{
  flip: boolean;
  fromZero: boolean;
}>`
  position: absolute;
  padding: 4px;

  transform: ${({ flip, fromZero }) =>
    flip ? "scaleX(-1);" : fromZero ? "rotate(180deg)" : ""};
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
  transition: 0.1s;
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

const Dot = styled.div<{
  color: string;
}>`
  height: 4px;
  width: 4px;
  background-color: ${({ color }) => color};
  border-radius: 2px;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  transition: 0.1s;
`;

const DotWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
