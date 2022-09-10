import styled from "styled-components";
import { Colors } from "../utils/theme";
import { EFFECTS } from "../webaudio/effectsWebAudio";
import { EmbossedLabel } from "./EmbossedLabel";
import { Knob, KnobText } from "./Knob";

interface TouchpadProps {
  text: string;
  onClick?: () => void;
  color?: string;
  glowColor?: string;
  disabled?: boolean;
  overlayText?: string;
}

const Touchpad = ({
  text,
  onClick,
  color = Colors.orange,
  glowColor = Colors.orangeGlow,
  disabled = false,
  overlayText,
}: TouchpadProps) => {
  return (
    <TouchpadWrapper
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
  effects: typeof EFFECTS;
  deckABpm: number;
  deckBBpm: number;
}

export function FX({ effects, deckABpm, deckBBpm }: Props) {
  return (
    <Wrapper>
      <Row>
        <Top>
          <EmbossedLabel fontSize="22px" text="FX" />
        </Top>
        <Knob
          color={Colors.deckA}
          glowColor={Colors.deckAGlow}
          size={40}
          text="Deck A"
          fromZero
          onChange={effects.changeDeckAInput}
          doubleClickValue={-50}
        />
        <Knob
          color={Colors.deckB}
          glowColor={Colors.deckbGlow}
          size={40}
          text="Deck B"
          fromZero
          onChange={effects.changeDeckBInput}
          doubleClickValue={-50}
        />
        <Knob
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          size={40}
          text="Reverb"
          fromZero
          onChange={effects.changeReverb}
          doubleClickValue={-50}
        />
        <Knob
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          size={40}
          text="Delay"
          fromZero
          onChange={effects.changeFeedback}
          doubleClickValue={-50}
        />
        <Knob
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          size={40}
          text="Dry / Wet"
          fromZero
          onChange={effects.changeDryWet}
          doubleClickValue={-50}
        />
        <Touchpad text={"Tap"} onClick={effects.handleTap} />
        <Touchpad text={"X2"} onClick={effects.handleX2} />
        <Touchpad
          disabled={deckABpm === 0}
          text={"SYNC A"}
          overlayText={deckABpm ? deckABpm.toFixed(2) : ""}
          color={Colors.deckA}
          glowColor={Colors.deckAGlow}
          onClick={() => {
            EFFECTS.setDelayTime(60 / deckABpm);
          }}
        />
        <Touchpad
          disabled={deckBBpm === 0}
          overlayText={deckBBpm ? deckBBpm.toFixed(2) : ""}
          text={"SYNC B"}
          color={Colors.deckB}
          glowColor={Colors.deckbGlow}
          onClick={() => {
            EFFECTS.setDelayTime(60 / deckBBpm);
          }}
        />
      </Row>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;
`;

const Top = styled.span`
  position: relative;
  padding: 18px 5px;

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
  border-bottom: 1px solid ${Colors.darkBorder};
  padding-bottom: 20px;
  justify-content: center;
  width: 100%;
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
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  margin-top: 2px;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  border: 1px solid transparent;

  span {
    opacity: 0.3;
  }

  &:active {
    border: 1px solid ${({ color }) => color};
    box-shadow: 0 0 4px 0 ${({ glowColor }) => glowColor};

    span {
      opacity: 1;
    }
  }

  @media screen and (max-width: 1000px) {
    width: 70px;
  }
`;

const TouchpadWrapper = styled.div<{
  disabled: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
  justify-content: space-between;
`;
