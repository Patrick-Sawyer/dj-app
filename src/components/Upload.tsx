import { ChangeEvent } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { HighlightedLabel } from "./HighlightedLabel";

interface Props {
  uploadTrack: (track: any) => void;
}

export function Upload({ uploadTrack }: Props) {
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const track = e.target.files?.[0];
    if (track) {
      uploadTrack(track);
    }
  };

  return (
    <Wrapper>
      <HighlightedLabel
        color={Colors.orange}
        glowColor={Colors.orangeGlow}
        text={"UPLOAD:"}
      />
      <Label>
        <Input
          type="file"
          name="file"
          onChange={handleUpload}
          accept="audio/mpeg3"
        />
        <Text>{"Click to choose file"}</Text>
      </Label>
    </Wrapper>
  );
}

const Text = styled.span`
  font-size: 13px;
  color: white;
  white-space: no-wrap;
  opacity: 0.3;
  transition: 0.1s;
  font-weight: 300;
  position: relative;
  bottom: 1px;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.3;
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
