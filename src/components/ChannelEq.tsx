import styled from 'styled-components'
import { Colors } from '../utils/theme'
import { Knob } from './Knob'
import { EmbossedLabel } from './EmbossedLabel'
import { DECKS } from '../webaudio/deckWebAudio'

interface Props {
  color: string;
  label: string;
  glowColor: string;
  deck: typeof DECKS.deckA;
}

export function ChannelEq ({ deck, color, label, glowColor }: Props) {
  const handleGain = (nextValue: number) => {
    const value = (nextValue + 50) / 100
    deck.setMasterGain(value)
  }

  const handleFilter = (nextValue: number) => {
    deck.setFilter(nextValue)
  }

  return (
    <EqWrapper>
      <EmbossedLabel text={label}/>
      <Knob glowColor={glowColor} color={color} text={'GAIN'} onChange={handleGain} size={25}/>
      <Knob glowColor={glowColor} color={color} text={'HIGH'} onChange={deck.changeHigh}/>
      <Knob glowColor={glowColor} color={color} text={'MID'} onChange={deck.changeMid} />
      <Knob glowColor={glowColor} color={color} text={'LOW'} onChange={deck.changeLow}/>
      <Knob glowColor={glowColor} color={color} onChange={handleFilter} text={'FILTER'} size={40} bypassValue={0}/>
    </EqWrapper>
  )
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
`
