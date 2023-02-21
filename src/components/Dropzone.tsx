import { useDropzone } from "react-dropzone";
import * as musicMetadata from "music-metadata-browser";
import { TuneData } from "../App";
import { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { UploadMultiple, UploadMusic } from "./Svg";

interface Props {
  setTunesLoading: (value: boolean) => void;
  tunes: TuneData[];
  setTunes: (tunes: TuneData[]) => void;
  tunesLoading: boolean;
}

const parseData = (data?: string | number | null, removeWhiteSpace = false) => {
  const trimmed = data ? data.toString()?.trim() : "-";
  return removeWhiteSpace ? trimmed.replace(/\s/g, "") : trimmed;
};

const parseBitRate = (bitrate: number | undefined): string | undefined => {
  if (!bitrate) return undefined;
  return Math.round(bitrate / 1000) + "kB";
};

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function DropZoneComponent({
  setTunesLoading,
  tunes,
  setTunes,
  tunesLoading,
}: Props) {
  const onDrop = useCallback(
    async (files: Array<Blob | MediaSource>) => {
      if (tunesLoading) return;
      setTunesLoading(true);

      await new Promise((r) => setTimeout(r, 10));

      if (files?.length) {
        const tracks = Object.values(files);
        const tunesToUpload = tracks.map((track) => URL.createObjectURL(track));

        const promises: Array<Promise<TuneData | null>> = tunesToUpload.map(
          async (tune) => {
            try {
              const data = await fetch(tune);
              const blob = await data.blob();
              const metadata = await musicMetadata.parseBlob(blob);
              const { artist, title, bpm, key } = metadata.common;
              const image =
                musicMetadata.selectCover(metadata.common.picture) || undefined;
              const genre = metadata.common.genre?.join(", ");
              const bitrate = parseBitRate(metadata.format.bitrate);
              const reactKey =
                (artist || "no-artist") +
                "-" +
                (title || "no-title") +
                "-" +
                create_UUID();

              return {
                blob,
                artist: parseData(artist),
                title: parseData(title),
                bpm: parseData(bpm, true),
                key: parseData(key, true),
                image,
                genre: parseData(genre),
                bitrate: parseData(bitrate, true),
                reactKey,
              };
            } catch {
              return null;
            }
          }
        );

        const tunesWithData = await Promise.all(promises);
        const filtered = tunesWithData.filter((tune) => tune!!) as TuneData[];
        const newTunes = [...tunes, ...filtered];
        setTunes(newTunes);
        await new Promise((r) => setTimeout(r, 10));
        setTunesLoading(false);
      }
    },
    [tunes, tunesLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Wrapper {...getRootProps()} highlight={isDragActive || tunesLoading}>
      <input {...getInputProps()} />
      <UploadMusic />
      <Text>
        {tunesLoading
          ? "Loading tracks, please wait..."
          : "Click or drop files here to import music"}
      </Text>
      <UploadMultiple />
    </Wrapper>
  );
}

export const DropZone = memo(DropZoneComponent);

const Wrapper = styled.div<{
  highlight: boolean;
}>`
  cursor: pointer;
  border-radius: 7px;
  gap: 40px;
  margin-top: 16px;
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  min-width: 500px;
  box-sizing: border-box;

  svg {
    opacity: 0.4;
  }

  &:hover {
    background-color: #151515;

    span {
      opacity: 1;
      color: ${Colors.deckB};
    }

    svg {
      opacity: 1;
    }

    path {
      fill: ${Colors.deckA};
    }
  }

  &:active {
    background-color: #151515;

    svg,
    span {
      color: ${Colors.lightGrey};
    }
    path {
      fill: ${Colors.lightGrey};
    }
  }

  ${({ highlight }) =>
    !!highlight &&
    `
    background-color: #151515;

    span {
      opacity: 1;
      color: ${Colors.deckB};
    }

    svg {
      opacity: 1;
    }

    path {
      fill: ${Colors.deckA};
    }
  `}
`;

const Text = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.3;
`;
