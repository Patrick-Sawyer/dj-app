import { memo } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { KnobText } from "../NewKnob/NewKnob";

interface TouchpadProps {
  text: string;
  onClick?: () => void;
  color?: string;
  glowColor?: string;
  disabled?: boolean;
  overlayText?: string;
  hideBelow?: number;
}

const TouchpadComponent = ({
  text,
  onClick,
  color = Colors.orange,
  glowColor = Colors.orangeGlow,
  disabled = false,
  overlayText,
  hideBelow,
}: TouchpadProps) => {
  return (
    <TouchpadWrapper
      hideBelow={hideBelow}
      disabled={disabled}
      onPointerDown={() => {
        if (!disabled && onClick) onClick();
      }}
    >
      <Pad
        disabled={disabled}
        color={disabled ? "transparent" : color}
        glowColor={disabled ? "transparent" : glowColor}
      >
        <span>{overlayText}</span>
      </Pad>
      {!disabled && (
        <KnobText color={color} glowColor={glowColor}>
          {text}
        </KnobText>
      )}
    </TouchpadWrapper>
  );
};

const Pad = styled.div<{
  color: string;
  glowColor: string;
  disabled: boolean;
}>`
  background-color: #131314;
  height: 55px;
  width: 75px;
  border-radius: 6px;
  color: ${(props) => props.color};
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 1);
  text-shadow: 0 0 10px ${({ glowColor }) => glowColor};
  margin-top: 2px;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  border: 1px solid transparent;

  @media screen and (pointer: coarse) {
    &:active {
      border: 1px solid ${({ color }) => color};
      box-shadow: 0 0 4px 0 ${({ glowColor }) => glowColor};
    }
  }

  @media screen and (pointer: fine) {
    &:hover {
      border: 1px solid ${({ color }) => color};
      box-shadow: 0 0 5px 0 ${({ glowColor }) => glowColor};
    }

    &:active {
      border: 1px solid transparent;
    }
  }

  @media screen and (max-width: 1040px) {
    width: 70px;
  }

  @media screen and (max-width: 1005px) {
    width: 60px;
  }
`;

const TouchpadWrapper = styled.div<{
  disabled: boolean;
  hideBelow?: number;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
  justify-content: space-between;

  ${({ hideBelow }) =>
    hideBelow &&
    `
    @media screen and (max-width: ${hideBelow}px) {
      display: none;
    }
  `}
`;

export const Touchpad = memo(TouchpadComponent);
