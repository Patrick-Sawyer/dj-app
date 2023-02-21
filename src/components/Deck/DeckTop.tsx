import { RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { TuneMetaData } from "../../App";
import { debouncer } from "../../utils/debouncer";
import { Deck } from "../../webaudio/deckWebAudio";
import { TrackInfo } from "./TrackInfo";
import { Waveform } from "./Waveform";

interface Props {
  deck: Deck;
  color: string;
  cuePoint: number | null;
  zoom: RefObject<{ value: number }>;
  metaData: TuneMetaData;
}

export function DeckTop({ deck, color, metaData, cuePoint, zoom }: Props) {
  const [position, setPosition] = useState<number>(0);
  const duration = deck.loadedTrack?.buffer?.duration;
  const [waveform, setWaveform] = useState<number[]>();

  useEffect(() => {
    deck.setWaveform = setWaveform;
    deck.updatePosition = debouncer(setPosition, 20);
  }, []);

  return (
    <Wrapper>
      <TrackInfo
        {...metaData}
        duration={duration}
        color={color}
        position={position}
      />
      <WaveformWrapper>
        <Waveform
          cuePoint={cuePoint}
          position={position}
          color={color}
          data={waveform}
          zoomInParent={zoom}
        />
      </WaveformWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  padding: 10px 10px 15px 10px;

  gap: 5px;

  height: 115px;
  min-height: 115px;
  max-height: 115px;
  justify-content: space-between;
  position: relative;

  @media screen and (max-width: 1000px) {
    padding-top: 5px;
    height: 100px;
    min-height: 100px;
    max-height: 100px;
  }
`;

const WaveformWrapper = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 15px;
`;
