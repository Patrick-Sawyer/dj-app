import { useEffect, useRef, useState } from "react";
import * as musicMetadata from "music-metadata-browser";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS, PlaybackStates } from "../webaudio/deckWebAudio";

const parseBitRate = (bitrate: number | undefined): string | undefined => {
  if (!bitrate) return undefined;
  return Math.round(bitrate / 1000) + "kB";
};

export interface TuneMetaData {
  artist?: string;
  title?: string;
  genre?: string;
  bitrate?: string;
  bpm?: string | number;
  key?: string;
  image?: musicMetadata.IPicture;
}

interface Props {
  tune: any;
  deleteTrack: (index: number) => void;
  index: number;
}

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

export const TuneTableRow = ({ tune, deleteTrack, index }: Props) => {
  const [data, setTuneData] = useState<TuneMetaData>({});
  const blobRef = useRef<Blob | null>(null);
  const { artist, title, genre, bitrate, bpm, key } = data;

  const onDoubleClick = () => {
    if (!blobRef.current) return;
    if (DECKS.deckA.playbackState === PlaybackStates.EMPTY) {
      DECKS.deckA.loadTrack(blobRef.current);
      DECKS.deckA.metaData = data;
    } else if (DECKS.deckB.playbackState === PlaybackStates.EMPTY) {
      DECKS.deckB.loadTrack(blobRef.current);
      DECKS.deckB.metaData = data;
    } else {
      alert("Eject a deck fool");
    }
  };

  useEffect(() => {
    fetch(tune)
      .then((blob) => blob.blob())
      .then((myBlob) => {
        blobRef.current = myBlob;
        musicMetadata.parseBlob(myBlob).then((metadata) => {
          const { artist, title, bpm, key } = metadata.common;
          const image =
            musicMetadata.selectCover(metadata.common.picture) || undefined;
          setTuneData({
            artist,
            title,
            image,
            genre: metadata.common.genre?.join(", "),
            bitrate: parseBitRate(metadata.format.bitrate),
            bpm,
            key: key?.replace(/ /g, ""),
          });
        });
      });
  }, [tune]);

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
          blobRef.current = null;
          deleteTrack(index);
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
