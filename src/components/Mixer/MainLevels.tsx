import { memo } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { DECKS } from "../../webaudio/deckWebAudio";
import { changeMasterVolume } from "../../webaudio/webAudio";
import { ChannelMeter } from "./ChannelMeter";
import { EmbossedLabel } from "../EmbossedLabel";
import { NewKnob } from "../NewKnob/NewKnob";

interface Props {
  decks: typeof DECKS;
}

function MainLevelsComponent({ decks }: Props) {
  return (
    <Wrapper>
      <EmbossedLabel text={"MAIN"} />
      <NewKnob
        color={Colors.orange}
        glowColor={Colors.orangeGlow}
        text={"LEVEL"}
        onChange={changeMasterVolume}
        size={40}
        fromZero
        initValue={0}
      />
      <Levels>
        <ChannelMeter deck={decks.deckA} />
        <ChannelMeter deck={decks.deckB} />
      </Levels>
    </Wrapper>
  );
}

export const MainLevels = memo(MainLevelsComponent);

const Levels = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  gap: 5px;
`;
const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  gap: 10px;
  padding-top: 20px;
  width: 100px;
  align-items: center;
  background-color: ${Colors.mainBackground};

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;
