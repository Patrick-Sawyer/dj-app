import { memo } from "react";
import styled from "styled-components";

interface NotchProps {
  rotate: number;
}

const NOTCHES = [
  0, 0.083, 0.166, 0.25, 0.333, 0.416, 0.5, 0.583, 0.666, 0.75, 0.833, 0.916,
];

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

const NotchesComponent = memo(() => {
  return (
    <>
      {NOTCHES.map((notch) => (
        <Notch key={notch} rotate={notch} />
      ))}
    </>
  );
});

interface Props {
  rotate: number;
}

export function Notches({ rotate }: Props) {
  return (
    <Wrapper
      style={{
        transform: `rotate(${rotate}turn)`,
      }}
    >
      <NotchesComponent />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
