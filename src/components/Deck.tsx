import styled from "styled-components";
import { Colors } from "../utils/theme";
import { Button } from "./Button";
import { TrackInfo } from "./TrackInfo";
import { JogWheel } from "./JogWheel";
import { Waveform } from "./Waveform";
import { DECKS, PlaybackStates } from "../webaudio/deckWebAudio";
import { useEffect, useRef, useState } from "react";
import { TuneMetaData } from "./TuneTableRow";
import { PitchControl } from "./PitchControl";

interface Props {
  color: string;
  glowColor: string;
  deck: typeof DECKS.deckA;
  reverse?: boolean;
  // setBpm: (bpm: number) => void;
  pitch: number;
  setPitch: (val: number) => void;
  setBpm: (val: number | undefined) => void;
}

const limit = (value: number) => {
  if (value > 0.005) return 0.005;
  if (value < -0.005) return -0.005;
  return value;
};

const accountForRotation = (last: number, current: number) => {
  if (last < -0.25 && current > 0.25) return last + 1;
  if (last > 0.25 && current < -0.25) return last - 1;
  return last;
};

const DEBOUNCE_TIME = 150;

const jogFuncGen = (handleJogWheel: (value: number, zoom: number) => void) => {
  let lastPosition: number | null = null;
  let lastDate: number | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (position: number, zoom: number) => {
    const date = new Date().getTime();
    if (!lastPosition || !lastDate) {
      lastPosition = position;
      lastDate = date;
    } else if (date - lastDate > DEBOUNCE_TIME) {
      if (timeout) clearTimeout(timeout);
      const withRotation = accountForRotation(lastPosition, position);
      const distance = position - withRotation;
      const time = date - lastDate;
      const speed = limit(distance / time);
      const nextValue = 1 + speed * 70;
      handleJogWheel(nextValue, zoom);
      lastPosition = position;
      lastDate = date;
      timeout = setTimeout(() => {
        handleJogWheel(1, zoom);
      }, DEBOUNCE_TIME);
    }
  };
};

export function Deck({
  color,
  glowColor,
  deck,
  reverse,
  pitch,
  setPitch,
  setBpm,
}: Props) {
  const [playbackState, setPlaybackState] = useState(PlaybackStates.EMPTY);
  const [position, setPosition] = useState<number>(0);
  const duration = deck.loadedTrack?.buffer?.duration;
  const [metaData, setMetaData] = useState<TuneMetaData>({});
  const [waveform, setWaveform] = useState<number[]>();
  const [sensitivityIndex, setSensitivityIndex] = useState(0);
  const [cuePoint, setCuePoint] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const zoom = useRef({
    value: 1,
  });
  deck.setPlaybackState = setPlaybackState;
  deck.setWaveform = setWaveform;
  deck.setCuePoint = setCuePoint;
  deck.updatePosition = setPosition;

  const handleEject = () => {
    if (deck.playbackState === PlaybackStates.PAUSED) {
      deck.eject();
      setMetaData({});
      return;
    }
  };

  const handlePlayPause = () => {
    deck.handlePlayPause();
  };

  const changeSensitivity = () => {
    setSensitivityIndex(
      sensitivityIndex === SENSITIVITIES.length - 1 ? 0 : sensitivityIndex + 1
    );
  };

  useEffect(() => {
    if (playbackState !== PlaybackStates.EMPTY && deck.metaData) {
      setMetaData(deck.metaData);
    }
  }, [deck.metaData, playbackState]);

  const pitchJog = jogFuncGen(deck.handleJogWheel);

  const handlePitchJog = (value: number) => {
    pitchJog(value, zoom.current.value);
  };

  useEffect(() => {
    if (deck.metaData.bpm) {
      const bpm = Number(deck.metaData.bpm);
      setBpm(bpm);
    } else {
      setBpm(undefined);
    }
  }, [playbackState]);

  return (
    <Wrapper reverse={reverse}>
      <Left>
        <Top>
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
              setPosition={setPosition}
              duration={duration}
              deck={deck}
              playbackState={playbackState}
              color={color}
              data={waveform}
              zoomInParent={zoom}
            />
          </WaveformWrapper>
        </Top>
        <Pitch ref={ref}>
          <JogWheel
            pitchJog={handlePitchJog}
            pitch={pitch}
            playbackState={playbackState}
            image={metaData.image}
            parentRef={ref}
            color={color}
          />
          <PitchLabel reverse={!reverse} color={color} bottom={"20px"}>
            {(pitch >= 1 ? "+" : "") + (100 * pitch - 100).toFixed(2) + "%"}
          </PitchLabel>
          <PitchButton
            reverse={reverse}
            color={color}
            onClick={changeSensitivity}
          >
            <PlusMinus>{"± "}</PlusMinus>
            <span>{SENSITIVITIES[sensitivityIndex].label}</span>
          </PitchButton>
        </Pitch>
        <Buttons>
          <Button
            color={color}
            glowColor={glowColor}
            disabled={
              playbackState === PlaybackStates.LOADING ||
              playbackState === PlaybackStates.EMPTY
            }
            width={"15%"}
            text={"rew"}
            onClick={deck.restart}
          />
          <Button
            color={color}
            glowColor={glowColor}
            disabled={
              playbackState === PlaybackStates.LOADING ||
              playbackState === PlaybackStates.EMPTY
            }
            text={playbackState === PlaybackStates.PLAYING ? "pause" : "play"}
            width={"35%"}
            onClick={handlePlayPause}
          />
          <Button
            color={color}
            glowColor={glowColor}
            disabled={
              playbackState === PlaybackStates.LOADING ||
              (playbackState === PlaybackStates.PLAYING && cuePoint === null) ||
              playbackState === PlaybackStates.EMPTY
            }
            text={"cue"}
            width={"35%"}
            onClick={deck.handleCuePoint}
          />
          <Button
            color={color}
            glowColor={glowColor}
            width={"15%"}
            disabled={playbackState !== PlaybackStates.PAUSED}
            text={"Eject"}
            onClick={handleEject}
          />
        </Buttons>
      </Left>
      <PitchControl
        reverse={!!reverse}
        lightOn={pitch === 1}
        sensitivity={SENSITIVITIES[sensitivityIndex].value}
        setPitch={setPitch}
        deck={deck}
        color={color}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  reverse?: boolean;
}>`
  display: flex;
  flex-direction: row-reverse;
  ${({ reverse }) => reverse && "flex-direction: row;"}
  flex: 1;
  max-width: 520px;
`;

const PlusMinus = styled.span`
  font-size: 15px;
  position: relative;
`;

const PitchButton = styled.button<{
  color?: string;
  reverse?: boolean;
}>`
  appearance: none;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  width: 75px;
  transition: 0.1s;
  padding: 2px 0;
  color: rgba(255, 255, 255, 0.8);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  position: absolute;
  bottom: 15px;
  ${({ reverse }) => (reverse ? "left: 20px" : "right: 20px")};

  &:hover {
    box-shadow: 0px 0px 5px 0 ${({ color }) => color};
    border: 1px solid ${({ color }) => color};
  }

  &:active {
    box-shadow: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const PitchLabel = styled.span<{
  color?: string;
  reverse?: boolean;
  bottom?: string;
  top?: string;
}>`
  color: ${({ color }) => color};
  font-size: 15px;
  width: 55px;
  display: flex;
  position: absolute;
  ${({ bottom }) => bottom && `bottom: ${bottom}`};
  ${({ top }) => top && `top: ${top}`};
  ${({ reverse }) => (reverse ? "left: 25px;" : "right: 25px;")}
`;

const Pitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  bottom: 5px;
`;

const Left = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: ${Colors.darkGreyBackground};
`;

const Top = styled.div`
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

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  position: relative;
  padding: 8px;
  gap: 8px;
  @media screen and (max-width: 1000px) {
    flex-wrap: wrap;
  }
`;

const SENSITIVITIES = [
  {
    value: 0.08,
    label: "8%",
  },
  {
    value: 0.1,
    label: "10%",
  },
  {
    value: 0.12,
    label: "12%",
  },
  {
    value: 0.25,
    label: "25%",
  },
  {
    value: 0.5,
    label: "50%",
  },
  {
    value: 1,
    label: "100%",
  },
];

const WaveformWrapper = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 15px;
`;
