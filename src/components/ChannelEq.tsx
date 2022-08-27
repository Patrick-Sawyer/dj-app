import styled from "styled-components";
import { Colors } from "../utils/theme";
import { Knob, KnobText } from "./Knob";
import { EmbossedLabel } from "./EmbossedLabel";
import { DECKS } from "../webaudio/deckWebAudio";
import { useState } from "react";

interface Props {
  color: string;
  label: string;
  glowColor: string;
  deck: typeof DECKS.deckA;
}

export function ChannelEq({ deck, color, label, glowColor }: Props) {
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

  return (
    <EqWrapper>
      <EmbossedLabel text={label} hideOnSmallScreen />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"GAIN"}
        onChange={handleGain}
        size={25}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"HIGH"}
        onChange={deck.changeHigh}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"MID"}
        onChange={deck.changeMid}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        text={"LOW"}
        onChange={deck.changeLow}
      />
      <Knob
        glowColor={glowColor}
        color={color}
        onChange={handleFilter}
        text={"FILTER"}
        size={40}
        bypassValue={0}
      />
      <KnobText
        fontSize="14px"
        glowColor={Colors.orangeGlow}
        color={Colors.orange}
        bypassed={!cue}
        onClick={handleCueClick}
      >
        {"CUE"}
      </KnobText>
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
