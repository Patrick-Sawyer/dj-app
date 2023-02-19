import { useEffect, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { Deck } from "../webaudio/deckWebAudio";
import { EmbossedLabel } from "./EmbossedLabel";
import { Knob, KnobText } from "./Knob";

interface TouchpadProps {
  text: string;
  onClick?: () => void;
  color?: string;
  glowColor?: string;
  disabled?: boolean;
  overlayText?: string;
  hideBelow?: number;
}

const Touchpad = ({
  text,
  onClick,
  color = Colors.orange,
  glowColor = Colors.orangeGlow,
  disabled = false,
  overlayText,
  hideBelow,
}: TouchpadProps) => {
  return (
    <TouchpadWrapper
      hideBelow={hideBelow}
      disabled={disabled}
      onPointerDown={() => {
        if (!disabled && onClick) onClick();
      }}
    >
      <Pad
        disabled={disabled}
        color={disabled ? "transparent" : color}
        glowColor={disabled ? "transparent" : glowColor}
      >
        <span>{overlayText}</span>
      </Pad>
      {!disabled && (
        <KnobText color={color} glowColor={glowColor}>
          {text}
        </KnobText>
      )}
    </TouchpadWrapper>
  );
};

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

const convertVal = (val: number): number => {
  return (val + 50) / 100;
};

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
      <Row>
        <Section>
          <Knob
            color={Colors.deckA}
            glowColor={Colors.deckAGlow}
            size={40}
            text="Dry / Wet"
            fromZero
            onChange={(input) => {
              const wetValue = convertVal(input);
              const dryValue = 1 - wetValue;
              deckA.wetEffects.gain.value = wetValue;
              deckA.dryValue.gain.value = dryValue;
            }}
            doubleClickValue={-50}
          />
          <Knob
            color={Colors.deckA}
            glowColor={Colors.deckAGlow}
            size={40}
            text="Reverb"
            fromZero
            onChange={(input) => {
              const value = convertVal(input);
              deckA.effects.reverbLevel.gain.value = value;
            }}
            doubleClickValue={-50}
          />
          <Knob
            color={Colors.deckA}
            glowColor={Colors.deckAGlow}
            size={40}
            text="Delay"
            fromZero
            onChange={(input) => {
              const value = convertVal(input);
              deckA.effects.delay.feedback.gain.value = value;
            }}
            doubleClickValue={-50}
          />
          {deckABpm ? (
            <Touchpad
              text={"SYNC DELAY"}
              overlayText={deckABpm.toFixed(2)}
              color={Colors.deckA}
              glowColor={Colors.deckAGlow}
              onClick={() => {
                deckA.effects.delay.handleChange(60 / deckABpm);
              }}
            />
          ) : (
            <Touchpad
              text={"TAP DELAY"}
              color={Colors.deckA}
              glowColor={Colors.deckAGlow}
              onClick={() => {
                deckA.effects.delay.tapDelay();
              }}
            />
          )}
          <Touchpad
            text={"X2"}
            hideBelow={830}
            color={Colors.deckA}
            glowColor={Colors.deckAGlow}
            onClick={() => {
              deckA.effects.delay.handle2X();
            }}
          />
          <Touchpad
            disabled={!deckBBpm || !deckABpm || !deckAInitBpm}
            text={"SYNC TO B"}
            hideBelow={970}
            overlayText={deckBBpm ? deckBBpm.toFixed(2) : ""}
            color={deckABpm === deckBBpm ? Colors.deckA : Colors.deckB}
            glowColor={
              deckABpm === deckBBpm ? Colors.deckAGlow : Colors.deckbGlow
            }
            onClick={() => {
              if (deckBBpm && deckAInitBpm) {
                const nextPitch = Number(deckBBpm) / Number(deckA.metaData.bpm);
                deckA.setPlayBackSpeed(nextPitch);
                deckA.effects.delay.handleChange(60 / deckBBpm);
                setDeckAPitch(nextPitch);
              }
            }}
          />
        </Section>
        <Section>
          <Knob
            color={Colors.deckB}
            glowColor={Colors.deckbGlow}
            size={40}
            text="Dry / Wet"
            fromZero
            onChange={(input) => {
              const wetValue = convertVal(input);
              const dryValue = 1 - wetValue;
              deckB.wetEffects.gain.value = wetValue;
              deckB.dryValue.gain.value = dryValue;
            }}
            doubleClickValue={-50}
          />
          <Knob
            color={Colors.deckB}
            glowColor={Colors.deckbGlow}
            size={40}
            text="Reverb"
            fromZero
            onChange={(input) => {
              const value = convertVal(input);
              deckB.effects.reverbLevel.gain.value = value;
            }}
            doubleClickValue={-50}
          />
          <Knob
            color={Colors.deckB}
            glowColor={Colors.deckbGlow}
            size={40}
            text="Delay"
            fromZero
            onChange={(input) => {
              const value = convertVal(input);
              deckB.effects.delay.feedback.gain.value = value;
            }}
            doubleClickValue={-50}
          />
          {deckBBpm ? (
            <Touchpad
              text={"SYNC DELAY"}
              overlayText={deckBBpm.toFixed(2)}
              color={Colors.deckB}
              glowColor={Colors.deckbGlow}
              onClick={() => {
                deckB.effects.delay.handleChange(60 / deckBBpm);
              }}
            />
          ) : (
            <Touchpad
              text={"TAP DELAY"}
              color={Colors.deckB}
              glowColor={Colors.deckbGlow}
              onClick={() => {
                deckB.effects.delay.tapDelay();
              }}
            />
          )}
          <Touchpad
            text={"X2"}
            hideBelow={830}
            color={Colors.deckB}
            glowColor={Colors.deckbGlow}
            onClick={() => {
              deckB.effects.delay.handle2X();
            }}
          />
          <Touchpad
            disabled={!deckBBpm || !deckABpm || !deckBInitBpm}
            text={"SYNC TO A"}
            hideBelow={970}
            overlayText={deckABpm ? deckABpm.toFixed(2) : ""}
            color={deckABpm === deckBBpm ? Colors.deckB : Colors.deckA}
            glowColor={
              deckABpm === deckBBpm ? Colors.deckbGlow : Colors.deckAGlow
            }
            onClick={() => {
              if (deckABpm && deckBInitBpm) {
                const nextPitch = Number(deckABpm) / Number(deckBInitBpm);
                deckB.setPlayBackSpeed(nextPitch);
                deckB.effects.delay.handleChange(60 / deckABpm);
                setDeckBPitch(nextPitch);
              }
            }}
          />
        </Section>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  border-bottom: 1px solid ${Colors.darkBorder};
  padding: 20px;
  justify-content: space-between;
`;

const Pad = styled.div<{
  color: string;
  glowColor: string;
  disabled: boolean;
}>`
  background-color: ${Colors.darkGreyBackground};
  height: 55px;
  width: 75px;
  border-radius: 6px;
  color: ${(props) => props.color};
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 10px ${({ glowColor }) => glowColor};
  margin-top: 2px;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  border: 1px solid transparent;

  @media screen and (pointer: coarse) {
    &:active {
      border: 1px solid ${({ color }) => color};
      box-shadow: 0 0 4px 0 ${({ glowColor }) => glowColor};
    }
  }

  @media screen and (pointer: fine) {
    &:hover {
      border: 1px solid ${({ color }) => color};
      box-shadow: 0 0 4px 0 ${({ glowColor }) => glowColor};
    }

    &:active {
      border: 1px solid transparent;
      box-shadow: none;
    }
  }

  @media screen and (max-width: 1040px) {
    width: 70px;
  }

  @media screen and (max-width: 1005px) {
    width: 60px;
  }
`;

const TouchpadWrapper = styled.div<{
  disabled: boolean;
  hideBelow?: number;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
  justify-content: space-between;

  ${({ hideBelow }) =>
    hideBelow &&
    `
    @media screen and (max-width: ${hideBelow}px) {
      display: none;
    }
  `}
`;

const Section = styled.div`
  display: flex;
  gap: 15px;
`;
