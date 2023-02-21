import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { DECKS } from "../../webaudio/deckWebAudio";
import { audioRouter } from "../../webaudio/webAudio";
import { ChannelEq } from "./ChannelEq";
import { MainLevels } from "./MainLevels";
import { Slider } from "./Slider";

interface Props {
  decks: typeof DECKS;
  router: typeof audioRouter;
}

export function Mixer({ decks, router }: Props) {
  const onCrossfadeChange = (value: number) => {
    const volumeB = Math.sqrt((value + 50) / 100);
    const volumeA = Math.sqrt(1 - (value + 50) / 100);
    DECKS.deckA.setVolume(volumeA);
    DECKS.deckB.setVolume(volumeB);
    router.handleHeadphoneVolumes();
  };

  return (
    <Wrapper>
      <Eq>
        <ChannelEq
          deck={decks.deckA}
          glowColor={Colors.deckAGlow}
          label="DECK-A"
          color={Colors.deckA}
          router={router}
          isDeckA
        />
        <MainLevels decks={decks} />
        <ChannelEq
          deck={decks.deckB}
          label="DECK-B"
          glowColor={Colors.deckbGlow}
          color={Colors.deckB}
          router={router}
        />
      </Eq>
      <SliderWrapper>
        <Slider onChange={onCrossfadeChange} />
      </SliderWrapper>
    </Wrapper>
  );
}

const SliderWrapper = styled.div`
  padding: 15px 20px;
  touch-action: none;
`;

const Wrapper = styled.div`
  border-bottom: 1px solid ${Colors.darkBorder};
  @media screen and (max-width: 1000px) {
    width: 170px;
  }
`;

const Eq = styled.div`
  display: flex;
  gap: 1px;
  border-bottom: 1px solid ${Colors.darkGreyBackground};
  background-color: ${Colors.darkGreyBackground};
`;
