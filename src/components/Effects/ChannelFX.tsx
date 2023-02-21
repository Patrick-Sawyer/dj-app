import { memo, useCallback } from "react";
import styled from "styled-components";
import { Deck } from "../../webaudio/deckWebAudio";
import { CONTEXT, FADE_IN_OUT_TIME } from "../../webaudio/webAudio";
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
  const handleDryWet = useCallback((input: number) => {
    const wetValue = convertVal(input);
    const dryValue = 1 - wetValue;
    deck.wetEffects.gain.linearRampToValueAtTime(
      wetValue,
      CONTEXT.currentTime + FADE_IN_OUT_TIME
    );
    deck.dryValue.gain.linearRampToValueAtTime(
      dryValue,
      CONTEXT.currentTime + FADE_IN_OUT_TIME
    );
  }, []);

  const handleReverb = useCallback((input: number) => {
    const value = convertVal(input);
    deck.effects.reverbLevel.gain.linearRampToValueAtTime(
      value,
      CONTEXT.currentTime + FADE_IN_OUT_TIME
    );
  }, []);

  const handleFeedback = useCallback((input: number) => {
    const value = convertVal(input);
    deck.effects.delay.feedback.gain.linearRampToValueAtTime(
      value,
      CONTEXT.currentTime + FADE_IN_OUT_TIME
    );
  }, []);

  const handleSyncDelay = useCallback(() => {
    thisDeckBpm && deck.effects.delay.handleChange(60 / thisDeckBpm);
  }, [thisDeckBpm]);

  const handleTap = useCallback(() => {
    deck.effects.delay.tapDelay();
  }, []);

  const handleX2 = useCallback(() => {
    deck.effects.delay.handle2X();
  }, []);

  const handleSyncDecks = useCallback(() => {
    if (otherDeckBpm && initBpm) {
      const nextPitch = Number(otherDeckBpm) / Number(deck.metaData.bpm);
      deck.setPlayBackSpeed(nextPitch);
      deck.effects.delay.handleChange(60 / otherDeckBpm);
      setPitch(nextPitch);
    }
  }, [otherDeckBpm, initBpm, deck.metaData.bpm]);

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
