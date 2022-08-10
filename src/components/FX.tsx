import styled from 'styled-components'
import { Colors } from '../utils/theme'
import { EFFECTS } from '../webaudio/effectsWebAudio'
import { Knob, KnobText } from './Knob'

interface TouchpadProps {
  text: string;
  onClick?: () => void;
  onRelease?: () => void;
}

const Touchpad = ({ text, onClick, onRelease }: TouchpadProps) => {
  return (
    <TouchpadWrapper onPointerDown={onClick} onPointerUp={onRelease} >
      <Pad />
      <KnobText color={Colors.orange} glowColor={Colors.orangeGlow}>{text}</KnobText>
    </TouchpadWrapper>
  )
}

interface Props {
  effects: typeof EFFECTS
}

export function FX ({
  effects
}: Props) {
  return (
    <Wrapper>
      <Knob
        color={Colors.deckA}
        size={40}
        text="Deck A"
        fromZero
        onChange={effects.changeDeckAInput}
        doubleClickValue={-50}
      />
      <Knob
        color={Colors.deckB}
        size={40}
        text="Deck B"
        fromZero
        onChange={effects.changeDeckBInput}
        doubleClickValue={-50}
      />
      <Knob
        color={Colors.orange}
        size={40}
        text="Reverb"
        fromZero
        onChange={effects.changeReverb}
        doubleClickValue={-50}
      />
      <Knob
        color={Colors.orange}
        size={40}
        text="Delay"
        fromZero
        onChange={effects.changeFeedback}
        doubleClickValue={-50}
      />
      <Knob
        color={Colors.orange}
        size={40}
        text="Dry / Wet"
        fromZero
        onChange={effects.changeDryWet}
        doubleClickValue={-50}
      />
      <Touchpad text={'Tap'} onClick={effects.handleTap}/>
      <Touchpad text={'X2'} onClick={effects.handleX2}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 25px;
  border-bottom: 1px solid ${Colors.darkBorder};
  padding-bottom: 20px;
  justify-content: center;
  width: 100%;
`

const Pad = styled.div`
  background-color: ${Colors.darkGreyBackground};
  height: 55px;
  width: 75px;
  border-radius: 6px;
  margin-top: 2px;
  cursor: pointer;
  border: 1px solid ${Colors.dullOrange};
  
  &:hover {
    border: 1px solid ${Colors.orange};
    box-shadow: 0 0 4px 0 ${Colors.orangeGlow};
  }

  &:active {
    border: 1px solid transparent;
    box-shadow: none;
  }
`

const TouchpadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

// size?: number;
//   text?: string;
//   color: string;
//   onChange?: (nextValue: number) => void;
//   glowColor?: string;
//   setBypass?: (nextValue: boolean) => void;
