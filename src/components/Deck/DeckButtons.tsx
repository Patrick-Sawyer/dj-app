import { memo } from "react";
import styled from "styled-components";
import { TuneMetaData } from "../../App";
import { Deck, PlaybackStates } from "../../webaudio/deckWebAudio";
import { Button } from "../Button";

interface Props {
  playbackState: PlaybackStates;
  deck: Deck;
  color: string;
  glowColor: string;
  setMetaData: (value: TuneMetaData) => void;
  cuePoint: number | null;
}

function DeckButtonsComponent({
  playbackState,
  deck,
  color,
  glowColor,
  setMetaData,
  cuePoint,
}: Props) {
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

  return (
    <Wrapper>
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
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

export const DeckButtons = memo(DeckButtonsComponent);
