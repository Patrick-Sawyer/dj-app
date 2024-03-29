import { memo } from "react";
import styled from "styled-components";

interface Props {
  isLoading: boolean;
  color: string;
}

interface LineProps {
  color: string;
}

const Thing = () => {
  return (
    <Inner>
      <Line />
    </Inner>
  );
};

const LoadingComponent = ({ isLoading, color }: Props) => {
  return (
    <Wrapper color={color} isLoading={isLoading}>
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
      <Thing />
    </Wrapper>
  );
};

export const Loading = memo(LoadingComponent, (prevProps, nextProps) => {
  return prevProps.isLoading === nextProps.isLoading;
});

const Wrapper = styled.div<{
  isLoading: boolean;
  color: string;
}>`
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
  transition: 0.1s;

  > div {
    animation: ${({ isLoading }) =>
      isLoading ? `lds-spinner 1.2s linear infinite` : "none"};
  }

  & div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  & div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  & div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  & div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  & div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  & div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  & div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  & div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  & div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  & div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  & div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  & div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const Line = styled.div`
  width: 5px;
  height: 20px;
  background-color: white;
  transform: scale(0.5);
  border-radius: 10px;
  position: relative;
  top: 25px;
`;

const Inner = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;
