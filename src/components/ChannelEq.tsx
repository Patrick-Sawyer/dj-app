import styled from "styled-components";
import { Colors } from "../utils/theme";
import { EmbossedLabel } from "./EmbossedLabel";
import { DECKS } from "../webaudio/deckWebAudio";
import {
  audioRouter,
  CONTEXT,
} from "../webaudio/webAudio";
import { KnobText, NewKnob } from "./NewKnob/NewKnob";
import { useState } from "react";

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
}: Props) {

  const [cued, setIsCued] = useState(false);

  const handleGain = (nextValue: number) => {
    const value = (nextValue + 50) / 100;
    deck.setMasterGain(value);
  };

  const handleFilter = (nextValue: number) => {
    deck.setFilter(nextValue);
  };

  const handleCueClick = () => {
    const nextState = !deck.isCued;
    deck.isCued = nextState;
    router.handleHeadphoneVolumes();
    setIsCued(nextState);
  };

  return (
    <EqWrapper>
      <EmbossedLabel text={label} hideOnSmallScreen />
      <NewKnob
        glowColor={glowColor}
        color={color}
        text={"GAIN"}
        initValue={0}
        onChange={handleGain}
        size={24}
        fromZero
        numberOfLights={14}
      />
      <NewKnob
        glowColor={glowColor}
        color={color}
        text={"HIGH"}
        onChange={deck.changeHigh}
        numberOfLights={17}
      />
      <NewKnob
        glowColor={glowColor}
        color={color}
        text={"MID"}
        onChange={deck.changeMid}
        numberOfLights={17}
      />
      <NewKnob
        glowColor={glowColor}
        color={color}
        text={"LOW"}
        onChange={deck.changeLow}
        numberOfLights={17}
      />
      <NewKnob
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
          bypassed={!cued}
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
