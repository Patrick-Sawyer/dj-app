import './App.css'
import styled from 'styled-components'
import { Deck } from './components/Deck'
import { useState } from 'react'
import { TuneTable } from './components/TuneTable'
import { Mixer } from './components/Mixer'
import { Colors } from './utils/theme'
import { DECKS } from './webaudio/deckWebAudio'
import { FX } from './components/FX'
import { EFFECTS } from './webaudio/effectsWebAudio'
import { Upload } from './components/Upload'

window.Buffer = window.Buffer || require('buffer').Buffer
window.process = window.process || require('process')

export interface DeckType {

}

function App () {
  const [tunes, setTunes] = useState<any[]>([])

  const uploadTrack = (tune: any) => {
    const tuneToAdd = URL.createObjectURL(tune)
    const newTunes = [...tunes, tuneToAdd]
    setTunes(newTunes)
  }

  return (
    <Outer>
      <Wrapper>
        <Decks>
          <Deck reverse deck={DECKS.deckA} color={Colors.deckA} glowColor={Colors.deckAGlow}/>
          <Mixer decks={DECKS} />
          <Deck deck={DECKS.deckB} color={Colors.deckB} glowColor={Colors.deckbGlow} />
        </Decks>
        <FX effects={EFFECTS} />
        <Upload uploadTrack={uploadTrack} />
        <TableWrapper>
          <TuneTable tunes={tunes}/>
        </TableWrapper>
      </Wrapper>
    </Outer>
  )
}

const Outer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media (min-width: 1144px) {
    align-items: center;
  } 
`

const Wrapper = styled.div`
  user-select: none;
  padding-bottom: 500px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  display: flex;
`

const Decks = styled.div`
  display: flex;
  width: 100%;
`

const TableWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`

export default App
