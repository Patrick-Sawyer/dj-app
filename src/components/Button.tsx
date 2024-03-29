import styled from "styled-components";
import { Colors } from "../utils/theme";

interface Props {
  text: string;
  onClick: () => void;
  color?: string;
  // eslint-disable-next-line no-undef
  icon?: JSX.Element;
  width?: string;
  glowColor?: string;
  disabled?: boolean;
}

export function Button({
  text,
  onClick,
  color,
  width,
  glowColor,
  disabled = false,
}: Props) {
  return (
    <Wrapper
      disabled={disabled}
      glowColor={glowColor}
      width={width}
      color={color}
      onPointerDown={onClick}
    >
      {text}
    </Wrapper>
  );
}

const Wrapper = styled.button<{
  color?: string;
  width?: string;
  glowColor?: string;
  disabled: boolean;
}>`
  appearance: none;
  outline: 0;
  border: 0;
  margin: 0;
  height: 35px;
  min-width: 65px;
  text-transform: uppercase;
  background-color: ${Colors.knobBackground};
  ${({ width }) => width && `width: ${width}`};
  border-radius: 2px;
  color: ${Colors.dirtyBrown};
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0px 1px 1px #3f3f3f;

  text-decoration: none;
  border: 1px solid #212121;
  box-shadow: inset 0px -3px 4px -2px ${Colors.dirtyBrown};
  ${({ glowColor, disabled }) =>
    !disabled && glowColor && `text-shadow: 0px 0px 7px ${glowColor};`}
  ${({ disabled, color }) =>
    !disabled &&
    `
    cursor: pointer;
    color: ${color};

    @media screen and (pointer: fine) {
      &:hover {
        border: 1px solid ${color};
      }

      &:active {
        text-shadow: none;
        box-shadow: none;
        border: 1px solid ${color};
        background-color: transparent;
        color: rgba(255,255,255,0.2);
      }
    }

    @media screen and (pointer: coarse) {
      &:active {
        border: 1px solid ${color};
      }
    }
  `}

  @media screen and (max-width: 1000px) {
    width: calc(50% - 4px);
  }
`;
