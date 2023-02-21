import { memo, useCallback } from "react";
import styled from "styled-components";
import { debouncer } from "../../utils/debouncer";
import { Deck } from "../../webaudio/deckWebAudio";
import { CONTEXT, FADE_IN_OUT_TIME, ZERO } from "../../webaudio/webAudio";
import { NewKnob } from "../NewKnob/NewKnob";
import { Touchpad } from "./Touchpad";

interface Props {
  color: string;
  glowColor: string;
  deck: Deck;
  otherDeckBpm?: number;
  thisDeckBpm?: number;
  otherDeckColor: string;
  otherDeckGlowColor: string;
  initBpm?: number;
  setPitch: (value: number) => void;
}

const convertVal = (val: number): number => {
  return (val + 50) / 100;
};

function ChannelFXComponent({
  color,
  glowColor,
  deck,
  otherDeckBpm,
  otherDeckColor,
  otherDeckGlowColor,
  thisDeckBpm,
  initBpm,
  setPitch,
}: Props) {
  const handleDryWet = useCallback(
    debouncer((input: number) => {
      const trueWetValue = convertVal(input);
      const trueDryValue = 1 - trueWetValue;
      const wetValue = trueWetValue < ZERO ? ZERO : trueWetValue;
      const dryValue = trueDryValue < ZERO ? ZERO : trueDryValue;

      deck.wetEffects.gain.linearRampToValueAtTime(
        wetValue,
        CONTEXT.currentTime + 0.1
      );
      deck.dryValue.gain.linearRampToValueAtTime(
        dryValue,
        CONTEXT.currentTime + 0.1
      );
    }, 101),
    []
  );

  const handleReverb = useCallback(
    debouncer((input: number) => {
      const value = convertVal(input);

      deck.effects.reverbLevel.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE_IN_OUT_TIME
      );
    }, 101),
    []
  );

  const handleFeedback = useCallback(
    debouncer((input: number) => {
      const value = convertVal(input);
      deck.effects.delay.feedback.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE_IN_OUT_TIME
      );
    }, 101),
    []
  );

  const handleSyncDelay = () => {
    thisDeckBpm && deck.effects.delay.handleChange(60 / thisDeckBpm);
  };

  const handleTap = () => {
    deck.effects.delay.tapDelay();
  };

  const handleX2 = () => {
    deck.effects.delay.handle2X();
  };

  const handleSyncDecks = () => {
    if (otherDeckBpm && initBpm) {
      const nextPitch = Number(otherDeckBpm) / Number(deck.metaData.bpm);
      deck.setPlayBackSpeed(nextPitch);
      deck.effects.delay.handleChange(60 / otherDeckBpm);
      setPitch(nextPitch);
    }
  };

  return (
    <Wrapper>
      <NewKnob
        color={color}
        glowColor={glowColor}
        size={40}
        text="Dry / Wet"
        fromZero
        onChange={handleDryWet}
        doubleClickValue={-50}
      />
      <NewKnob
        color={color}
        glowColor={glowColor}
        size={40}
        text="Reverb"
        fromZero
        onChange={handleReverb}
        doubleClickValue={-50}
      />
      <NewKnob
        color={color}
        glowColor={glowColor}
        size={40}
        text="Delay"
        fromZero
        onChange={handleFeedback}
        doubleClickValue={-50}
      />
      {thisDeckBpm ? (
        <Touchpad
          text={"SYNC DELAY"}
          overlayText={thisDeckBpm.toFixed(2)}
          color={color}
          glowColor={glowColor}
          onClick={handleSyncDelay}
        />
      ) : (
        <Touchpad
          text={"TAP DELAY"}
          color={color}
          glowColor={glowColor}
          onClick={handleTap}
        />
      )}
      <Touchpad
        text={"X2"}
        hideBelow={830}
        color={color}
        glowColor={glowColor}
        onClick={handleX2}
      />
      <Touchpad
        disabled={!otherDeckBpm || !thisDeckBpm || !initBpm}
        text={"SYNC TO B"}
        hideBelow={970}
        overlayText={otherDeckBpm ? otherDeckBpm.toFixed(2) : ""}
        color={thisDeckBpm === otherDeckBpm ? color : otherDeckColor}
        glowColor={
          thisDeckBpm === otherDeckBpm ? glowColor : otherDeckGlowColor
        }
        onClick={handleSyncDecks}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
`;

export const ChannelFX = memo(ChannelFXComponent);
