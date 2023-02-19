import { ChangeEvent } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { HighlightedLabel } from "./HighlightedLabel";

interface Props {
  setTunes: (tracks: any[]) => void;
  tunes: any[];
}

export function Upload({ tunes, setTunes }: Props) {
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      const newTunes = [...tunes];
      const tracks = Object.values(e.target.files)

      for (const track of tracks) {
        const tuneToAdd = URL.createObjectURL(track);
        newTunes.push(tuneToAdd);
      }

      setTunes(newTunes);
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
          accept="audio/*"
          multiple
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
