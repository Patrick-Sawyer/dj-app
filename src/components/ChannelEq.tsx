import styled from "styled-components";
import { Colors } from "../utils/theme";
import { Knob, KnobText } from "./Knob";
import { EmbossedLabel } from "./EmbossedLabel";
import { DECKS } from "../webaudio/deckWebAudio";
import { useEffect, useState } from "react";
import {
  audioRouter,
  CONTEXT,
  FADE_IN_OUT_TIME,
  isFireFox,
  ZERO,
} from "../webaudio/webAudio";

interface Props {
  color: string;
  label: string;
  glowColor: string;
  deck: typeof DECKS.deckA;
  router: typeof audioRouter;
  isDeckA?: boolean;
}

export function ChannelEq({
  deck,
  color,
  label,
  glowColor,
  router,
  isDeckA,
}: Props) {
  const [cue, setCue] = useState(false);

  const handleGain = (nextValue: number) => {
    const value = (nextValue + 50) / 100;
    deck.setMasterGain(value);
  };

  const handleFilter = (nextValue: number) => {
    deck.setFilter(nextValue);
  };

  const handleCueClick = () => {
    setCue(!cue);
  };

  useEffect(() => {
    if (CONTEXT.state === "suspended") CONTEXT.resume();
    router[isDeckA ? "deckA" : "deckB"].gain.cancelScheduledValues(
      CONTEXT.currentTime
    );
    const level = cue ? 1 : ZERO;
    const time = CONTEXT.currentTime + FADE_IN_OUT_TIME;
    if (isFireFox) {
      router[isDeckA ? "deckA" : "deckB"].gain.linearRampToValueAtTime(
        level,
        time
      );
    } else {
      router[isDeckA ? "deckA" : "deckB"].gain.exponentialRampToValueAtTime(
        level,
        time
      );
    }
  }, [cue]);

  return (
    <EqWrapper>
      <EmbossedLabel text={label} hideOnSmallScreen />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"GAIN"}
        onChange={handleGain}
        size={25}
        numberOfLights={15}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"HIGH"}
        onChange={deck.changeHigh}
        numberOfLights={17}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"MID"}
        onChange={deck.changeMid}
        numberOfLights={17}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"LOW"}
        onChange={deck.changeLow}
        numberOfLights={17}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        onChange={handleFilter}
        text={"FILTER"}
        size={40}
        bypassValue={0}
      />
      {CONTEXT.destination.maxChannelCount >= 4 && (
        <KnobText
          fontSize="14px"
          glowColor={Colors.orangeGlow}
          color={Colors.orange}
          bypassed={!cue}
          onClick={handleCueClick}
        >
          {"CUE"}
        </KnobText>
      )}
    </EqWrapper>
  );
}

export const EqWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  gap: 10px;
  padding: 20px 0;
  width: 80px;
  align-items: center;
  background-color: ${Colors.mainBackground};
`;
