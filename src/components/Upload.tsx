import { ChangeEvent } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { HighlightedLabel } from "./HighlightedLabel";
import * as musicMetadata from "music-metadata-browser";
import { TuneData } from "../App";

interface Props {
  setTunes: (tracks: any[]) => void;
  tunes: any[];
}

const parseBitRate = (bitrate: number | undefined): string | undefined => {
  if (!bitrate) return undefined;
  return Math.round(bitrate / 1000) + "kB";
};

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
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

      const promises: Array<Promise<TuneData | null>> = newTunes.map(async (tune) => {
        try {
          const data = await fetch(tune)
          const blob = await data.blob();
          const metadata = await musicMetadata.parseBlob(blob);
          const { artist, title, bpm, key } = metadata.common;
          const image = musicMetadata.selectCover(metadata.common.picture) || undefined;
          const genre = metadata.common.genre?.join(", ");
          const bitrate = parseBitRate(metadata.format.bitrate);
          const reactKey = (artist || 'no-artist') + '-' + (title || 'no-title') + '-' + create_UUID();

          return {
            blob,
            artist: artist?.toString(),
            title: title?.toString(),
            bpm: bpm?.toString(),
            key: key?.toString(),
            image,
            genre: genre?.toString(),
            bitrate: bitrate?.toString(),
            reactKey
          }
        } catch {
          return null;
        }
      })

      const tunesWithData = await Promise.all(promises);

      setTunes(tunesWithData.filter((tune) => !!tune));
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
        <Text>{"Click to choose file(s)"}</Text>
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
