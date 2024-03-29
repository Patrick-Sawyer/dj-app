import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { Deck } from "../../webaudio/deckWebAudio";
import { ChannelFX } from "./ChannelFX";

interface Props {
  deckA: Deck;
  deckB: Deck;
  deckAPitch: number;
  deckBPitch: number;
  deckAInitBpm?: number;
  deckBInitBpm?: number;
  setDeckAPitch: (val: number) => void;
  setDeckBPitch: (val: number) => void;
}

export function FX({
  deckA,
  deckB,
  deckBPitch,
  deckAPitch,
  deckAInitBpm,
  deckBInitBpm,
  setDeckAPitch,
  setDeckBPitch,
}: Props) {
  const deckABpm = deckAInitBpm ? deckAInitBpm * deckAPitch : undefined;
  const deckBBpm = deckBInitBpm ? deckBInitBpm * deckBPitch : undefined;

  return (
    <Wrapper>
      <ChannelFX
        color={Colors.deckA}
        glowColor={Colors.deckAGlow}
        otherDeckColor={Colors.deckB}
        otherDeckGlowColor={Colors.deckbGlow}
        initBpm={deckAInitBpm}
        thisDeckBpm={deckABpm}
        otherDeckBpm={deckBBpm}
        deck={deckA}
        setPitch={setDeckAPitch}
      />
      <ChannelFX
        color={Colors.deckB}
        glowColor={Colors.deckbGlow}
        otherDeckColor={Colors.deckA}
        otherDeckGlowColor={Colors.deckAGlow}
        initBpm={deckBInitBpm}
        thisDeckBpm={deckBBpm}
        otherDeckBpm={deckABpm}
        deck={deckB}
        setPitch={setDeckBPitch}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
  border-bottom: 1px solid ${Colors.darkBorder};
  padding: 20px;
  justify-content: space-between;
  position: relative;
`;

const Section = styled.div`
  display: flex;
  gap: 15px;
`;
