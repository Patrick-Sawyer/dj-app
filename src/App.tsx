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
  const [deckABpm, setDeckABpm] = useState(0)
  const [deckBBpm, setDeckBBpm] = useState(0)

  const uploadTrack = (tune: any) => {
    const tuneToAdd = URL.createObjectURL(tune)
    const newTunes = [...tunes, tuneToAdd]
    setTunes(newTunes)
  }

  const deleteTrack = (index: number) => {
    const newTunes = [...tunes].filter((_, i) => i !== index)
    setTunes(newTunes)
  }

  return (
    <Outer>
      <Wrapper>
        <Decks>
          <Deck otherBPM={deckBBpm} setBpm={setDeckABpm} thisBPM={deckABpm} reverse deck={DECKS.deckA} color={Colors.deckA} glowColor={Colors.deckAGlow}/>
          <Mixer decks={DECKS} />
          <Deck otherBPM={deckABpm} setBpm={setDeckBBpm} thisBPM={deckBBpm} deck={DECKS.deckB} color={Colors.deckB} glowColor={Colors.deckbGlow} />
        </Decks>
        <FX deckABpm={deckABpm} deckBBpm={deckBBpm} effects={EFFECTS} />
        <Upload uploadTrack={uploadTrack} />
        <TableWrapper>
          <TuneTable deleteTrack={deleteTrack} tunes={tunes}/>
        </TableWrapper>
      </Wrapper>
    </Outer>
  )
}

const Outer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 15px;
  align-items: center;
  width: 100%;
  min-width: 1269px;
`

const Wrapper = styled.div`
  user-select: none;
  padding-bottom: 500px;
  flex-direction: column;

  display: flex;
`

const Decks = styled.div`
  display: flex;
`

const TableWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  width: 100%;
`

export default App
