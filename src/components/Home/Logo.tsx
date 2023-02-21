import { memo } from "react";
import styled from "styled-components";

function LogoComponent() {
  return (
    <Wrapper>
      <Graffiti>{"Turntablism"}</Graffiti>
      <Text>{".app"}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 5px;
  position: relative;
  top: 7px;
`;

const Graffiti = styled.span`
  font-family: Graf;
  font-size: 42px;
  opacity: 0.9;

  @media screen and (max-width: 1100px) {
    font-size: 30px;
  }

  @media screen and (max-width: 900px) {
    font-size: 20px;
  }
`;

const Text = styled.span`
  font-size: 25px;
  opacity: 0.5;

  @media screen and (max-width: 1100px) {
    font-size: 15px;
  }

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

export const Logo = memo(LogoComponent);
