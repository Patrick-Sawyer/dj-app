import { memo } from "react";
import styled from "styled-components";

interface Props {
  offset: number;
  onMouseDown: (e: any) => void;
  reset: () => void;
}

function PitchSliderComponent({ offset, onMouseDown, reset }: Props) {
  return (
    <Wrapper
      onPointerDown={onMouseDown}
      onDoubleClick={reset}
      style={{
        transform: `translateY(${offset + 1}px)`,
      }}
    >
      <Fade />
      <Middle>
        <Marker />
      </Middle>
      <Fade />
    </Wrapper>
  );
}

export const PitchSlider = memo(PitchSliderComponent);

const Wrapper = styled.div`
  background-color: #ababab;
  height: 70px;
  width: 35px;
  display: flex;
  flex-direction: column;
  touch-action: none;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  z-index: 4;
`;

const Fade = styled.div`
  box-shadow: inset 0px 50px 50px -30px rgba(0, 0, 0, 0.6);
  width: 100%;
  flex: 3;
`;

const Middle = styled.div`
  flex: 2;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Marker = styled.div`
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.8);
`;
