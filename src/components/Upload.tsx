import { ChangeEvent } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { HighlightedLabel } from "./HighlightedLabel";

interface Props {
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Upload({ handleUpload }: Props) {
  return (
    <Wrapper>
      <Label>
        <Input
          type="file"
          name="file"
          onChange={handleUpload}
          accept="audio/*"
          multiple
        />
        <HighlightedLabel
          color={Colors.deckB}
          glowColor={Colors.deckbGlow}
          text={"UPLOAD TRACKS"}
        />
        <Text>{"Click to choose files"}</Text>
      </Label>
    </Wrapper>
  );
}

const Text = styled.span`
  font-size: 13px;
  color: white;
  white-space: no-wrap;

  transition: 0.1s;
  font-weight: 300;
  position: relative;
  bottom: 1px;

  @media (pointer: fine) {
    opacity: 0.3;

    &:hover {
      opacity: 1;
    }

    &:active {
      opacity: 0.3;
    }
  }

  @media screen and (pointer: coarse) {
    &:active {
      opacity: 0.3;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: center;
  justify-content: center;
`;

const Input = styled.input`
  display: none;
  margin: 0;
  padding: 0;
`;

const Label = styled.label`
  cursor: pointer;
`;
