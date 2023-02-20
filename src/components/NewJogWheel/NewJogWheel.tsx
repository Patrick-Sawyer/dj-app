import styled from "styled-components";
import * as musicMetadata from "music-metadata-browser";
import { PlaybackStates } from "../../webaudio/deckWebAudio";
import { Wheel } from "./Wheel";
import { useEffect, useState } from "react";

interface Props {
  playbackState: PlaybackStates;
  image?: musicMetadata.IPicture;
  onChange: (pitch: number) => void;
  loadingColor: string;
}

const PICSUM = "https://picsum.photos/200/300";

export function NewJogWheel({
  playbackState,
  image,
  onChange,
  loadingColor,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    if (image) {
      const blob = new Blob([image.data]);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return;
    }

    setImageUrl(PICSUM);
  }, [image]);

  return (
    <Wrapper>
      <Wheel
        playbackState={playbackState}
        imageUrl={imageUrl}
        loadingColor={loadingColor}
        onChange={onChange}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 280px;
  height: 280px;

  @media screen and (max-width: 1100px) {
    width: 250px;
    height: 250px;
  }

  @media screen and (max-width: 1000px) {
    width: 230px;
    height: 230px;
  }

  @media screen and (max-width: 850px) {
    width: 210px;
    height: 210px;
  }
`;
