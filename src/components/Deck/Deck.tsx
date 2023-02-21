import styled from "styled-components";
import { DECKS, PlaybackStates } from "../../webaudio/deckWebAudio";
import { memo, useEffect, useRef, useState } from "react";
import { PitchControl } from "../PitchControl/PitchControl";
import { TuneMetaData } from "../../App";
import { NewJogWheel } from "../NewJogWheel/NewJogWheel";
import { Colors } from "../../utils/theme";
import { DeckTop } from "./DeckTop";
import { DeckButtons } from "./DeckButtons";

interface Props {
  color: string;
  glowColor: string;
  deck: typeof DECKS.deckA;
  reverse?: boolean;
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

function DeckComponent({
  color,
  glowColor,
  deck,
  reverse,
  setPitch,
  setBpm,
}: Props) {
  const [playbackState, setPlaybackState] = useState(PlaybackStates.EMPTY);
  const [metaData, setMetaData] = useState<TuneMetaData>({});
  const [sensitivityIndex, setSensitivityIndex] = useState(0);
  const [cuePoint, setCuePoint] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const zoom = useRef({
    value: 1,
  });

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

  useEffect(() => {
    deck.setPlaybackState = setPlaybackState;
    deck.setCuePoint = setCuePoint;
  }, []);

  return (
    <Wrapper reverse={reverse}>
      <Left>
        <DeckTop
          deck={deck}
          color={color}
          cuePoint={cuePoint}
          zoom={zoom}
          metaData={metaData}
        />
        <Pitch ref={ref}>
          <NewJogWheel
            playbackState={playbackState}
            loadingColor={glowColor}
            image={metaData.image}
            onChange={handlePitchJog}
          />
          <PitchButton
            reverse={reverse}
            color={color}
            onClick={changeSensitivity}
          >
            <PlusMinus>{"± "}</PlusMinus>
            <span>{SENSITIVITIES[sensitivityIndex].label}</span>
          </PitchButton>
        </Pitch>
        <DeckButtons
          color={color}
          glowColor={glowColor}
          deck={deck}
          playbackState={playbackState}
          cuePoint={cuePoint}
          setMetaData={setMetaData}
        />
      </Left>
      <PitchControl
        reverse={!!reverse}
        sensitivity={SENSITIVITIES[sensitivityIndex].value}
        setPitch={setPitch}
        deck={deck}
        color={color}
      />
    </Wrapper>
  );
}

export const Deck = memo(DeckComponent);

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
  bottom: 5px;
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
  background-color: ${Colors.darkBorder};
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
