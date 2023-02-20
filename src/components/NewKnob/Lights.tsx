import { memo } from "react";
import styled from "styled-components";

interface Props {
  numberOfLights: number;
  fromZero: boolean;
  percentage: number;
  color: string;
  glowColor: string;
}

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

interface LightProps {
  color: string;
  glowColor?: string;
  active: boolean;
  rotate: number;
}

const Light = memo(
  ({ color, glowColor, active, rotate }: LightProps) => {
    return (
      <LightOuter rotate={rotate}>
        <LightInner active={active} color={color} glowColor={glowColor} />
      </LightOuter>
    );
  },
  (prevProps, nextProps) => prevProps.active === nextProps.active
);

function LightsComponent({
  numberOfLights,
  fromZero,
  percentage,
  color,
  glowColor,
}: Props) {
  return (
    <>
      {new Array(numberOfLights).fill(null).map((_, index) => {
        let rotate = (index * 360) / numberOfLights;
        let active = isActive(numberOfLights, index, percentage, fromZero);

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
      })}
    </>
  );
}

export const Lights = memo(LightsComponent, (prevProps, nextProps) => {
  return prevProps.percentage === nextProps.percentage;
});

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
