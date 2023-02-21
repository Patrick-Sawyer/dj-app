import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { DECKS, PlaybackStates } from "../../webaudio/deckWebAudio";
import { TuneData } from "../../App";
import { DeleteIcon } from "../Svg";
import { memo, useCallback, useRef } from "react";

interface Props {
  data: TuneData;
  deleteTrack?: (reactKey: string) => void;
}

const TuneTableRowComponent = ({ data, deleteTrack }: Props) => {
  const { artist, title, genre, bitrate, bpm, key } = data;
  const disabled = useRef(false);

  const onClick = useCallback(() => {
    if (!data.blob || disabled.current) return;
    disabled.current = true;
    if (DECKS.deckA.playbackState === PlaybackStates.EMPTY) {
      DECKS.deckA.loadTrack(data.blob);
      DECKS.deckA.metaData = data;
    } else if (DECKS.deckB.playbackState === PlaybackStates.EMPTY) {
      DECKS.deckB.loadTrack(data.blob);
      DECKS.deckB.metaData = data;
    }
    setTimeout(() => {
      disabled.current = false;
    }, 500);
  }, []);

  return (
    <Row onClick={onClick}>
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
    </Row>
  );
};

export const TuneTableRow = memo(TuneTableRowComponent);

const IconWrapper = styled.div`
  height: 15px;
  width: 15px;
  opacity: 0.3;

  &:hover {
    opacity: 0.8;
    path {
      fill: ${Colors.white};
    }
  }
`;

const Row = styled.tr`
  cursor: pointer;
  position: relative;

  &:hover {
    td {
      background-color: #1a1a1a;
      color: ${Colors.deckB};
    }
  }
`;

const Cell = styled.td<{
  hideBelow?: number;
}>`
  font-size: 11px;
  padding: 7px 10px;
  color: white;

  background-color: #232323;
  color: rgba(255, 255, 255, 0.7);
  height: 15px;
  font-weight: 600;

  ${({ hideBelow }) =>
    !!hideBelow &&
    `
    @media screen and (max-width: ${hideBelow}px) {
      display: none;
    }
  `}
`;
