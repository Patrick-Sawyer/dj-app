import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS, PlaybackStates } from "../webaudio/deckWebAudio";
import { TuneData } from "../App";


interface Props {
  data: TuneData;
  deleteTrack: (reactKey: string) => void;
}

export const TuneTableRow = ({ data, deleteTrack }: Props) => {
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

  return (
    <Row onDoubleClick={onDoubleClick}>
      <Cell>{artist}</Cell>
      <Cell>{title}</Cell>
      <Cell>{genre}</Cell>
      <Cell>{bpm}</Cell>
      <Cell>{key}</Cell>
      <Cell>{bitrate}</Cell>
      <Cell
        onPointerDown={() => {
          deleteTrack(data.reactKey);
        }}
      >
        {"X"}
      </Cell>
    </Row>
  );
};

const Row = styled.tr`
  cursor: pointer;

  td:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

  &:hover {
    td {
      background-color: #989799;
      color: white;
    }
  }
`;

const Cell = styled.td`
  font-size: 11px;
  padding: 7px 10px;
  color: white;

  background-color: ${Colors.tableBackground};
  color: black;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 15px;
`;
