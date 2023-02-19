import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS, PlaybackStates } from "../webaudio/deckWebAudio";
import { TuneData } from "../App";
import { DeleteIcon } from "./Svg";
import { ChangeEvent } from "react";

interface Props {
  data: TuneData;
  deleteTrack?: (reactKey: string) => void;
  handleUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TuneTableRow = ({ data, deleteTrack, handleUpload }: Props) => {
  const { artist, title, genre, bitrate, bpm, key } = data;

  const onDoubleClick = () => {
    if (!data.blob) return;
    if (DECKS.deckA.playbackState === PlaybackStates.EMPTY) {
      DECKS.deckA.loadTrack(data.blob);
      DECKS.deckA.metaData = data;
    } else if (DECKS.deckB.playbackState === PlaybackStates.EMPTY) {
      DECKS.deckB.loadTrack(data.blob);
      DECKS.deckB.metaData = data;
    }
  };

  const UploadCell = ({
    text,
    hideBelow,
  }: {
    text: string;
    hideBelow?: number;
  }) => {
    return (
      <Cell hideBelow={hideBelow}>
        <Label>
          <Input
            type="file"
            name="file"
            onChange={handleUpload}
            accept="audio/*"
            multiple
          />
        </Label>
        {text}
      </Cell>
    );
  };

  return (
    <Row onDoubleClick={onDoubleClick}>
      {!!handleUpload ? (
        <>
          <UploadCell text={"Upload some tracks..."} />
          <UploadCell text={"Upload some tracks..."} />
          <UploadCell text={"..."} />
          <UploadCell text={"..."} />
          <UploadCell text={"..."} />
          <UploadCell hideBelow={1000} text={"..."} />
          <Cell>
            <IconWrapper>
              <DeleteIcon />
            </IconWrapper>
          </Cell>
        </>
      ) : (
        <>
          <Cell>{artist}</Cell>
          <Cell>{title}</Cell>
          <Cell>{genre}</Cell>
          <Cell>{bpm}</Cell>
          <Cell>{key}</Cell>
          <Cell hideBelow={1000}>{bitrate}</Cell>
          <Cell
            onPointerDown={() => {
              deleteTrack && deleteTrack(data.reactKey);
            }}
          >
            <IconWrapper>
              <DeleteIcon />
            </IconWrapper>
          </Cell>
        </>
      )}
    </Row>
  );
};

const Label = styled.label`
  width: 100%;
  position: absolute;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
`;

const Input = styled.input`
  display: none;
  margin: 0;
  padding: 0;
`;

const IconWrapper = styled.div`
  height: 15px;
  width: 15px;
  opacity: 0.3;

  &:hover {
    opacity: 0.8;
    path {
      fill: white;
    }
  }
`;

const Row = styled.tr`
  cursor: pointer;
  position: relative;

  &:hover {
    td {
      background-color: #646464;
      color: white;
    }
  }
`;

const Cell = styled.td<{
  hideBelow?: number;
}>`
  font-size: 11px;
  padding: 7px 10px;
  color: white;

  background-color: ${Colors.tableBackground};
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  height: 15px;

  ${({ hideBelow }) =>
    !!hideBelow &&
    `
    @media screen and (max-width: ${hideBelow}px) {
      display: none;
    }
  `}
`;
