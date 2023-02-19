import "./App.css";
import styled from "styled-components";
import { Deck } from "./components/Deck";
import { useState } from "react";
import { TuneTable } from "./components/TuneTable";
import { Mixer } from "./components/Mixer";
import { Colors } from "./utils/theme";
import { DECKS } from "./webaudio/deckWebAudio";
import { FX } from "./components/FX";
import { Upload } from "./components/Upload";
import { AudioConfig } from "./components/AudioConfig";
import { audioRouter } from "./webaudio/webAudio";

window.Buffer = window.Buffer || require("buffer").Buffer;
window.process = window.process || require("process");

export interface DeckType {}

function App() {
  const [tunes, setTunes] = useState<any[]>([]);
  const [deckApitch, setDeckAPitch] = useState(1);
  const [deckAInitBpm, setDeckAInitBpm] = useState<number>();
  const [deckBInitBpm, setDeckBInitBpm] = useState<number>();
  const [deckBpitch, setDeckBPitch] = useState(1);

  const uploadTrack = (tune: any) => {
    const tuneToAdd = URL.createObjectURL(tune);
    const newTunes = [...tunes, tuneToAdd];
    setTunes(newTunes);
  };

  const deleteTrack = (index: number) => {
    const newTunes = [...tunes].filter((_, i) => i !== index);
    setTunes(newTunes);
  };

  return (
    <Outer>
      <Wrapper>
        <Decks>
          <Deck
            reverse
            deck={DECKS.deckA}
            color={Colors.deckA}
            glowColor={Colors.deckAGlow}
            pitch={deckApitch}
            setPitch={setDeckAPitch}
            setBpm={setDeckAInitBpm}
          />
          <Mixer router={audioRouter} decks={DECKS} />
          <Deck
            deck={DECKS.deckB}
            color={Colors.deckB}
            glowColor={Colors.deckbGlow}
            pitch={deckBpitch}
            setPitch={setDeckBPitch}
            setBpm={setDeckBInitBpm}
          />
        </Decks>
        <FX
          deckA={DECKS.deckA}
          deckAPitch={deckApitch}
          deckAInitBpm={deckAInitBpm}
          deckBInitBpm={deckBInitBpm}
          deckBPitch={deckBpitch}
          deckB={DECKS.deckB}
          setDeckAPitch={setDeckAPitch}
          setDeckBPitch={setDeckBPitch}
        />
        <ConfigAndUpload>
          <Upload uploadTrack={uploadTrack} />
          <AudioConfig decks={DECKS} router={audioRouter} />
        </ConfigAndUpload>
      </Wrapper>
      <TableWrapper>
        <TuneTable deleteTrack={deleteTrack} tunes={tunes} />
      </TableWrapper>
    </Outer>
  );
}

const ConfigAndUpload = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  padding: 0 5px;
`;

const Outer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 750px;
  padding-bottom: 500px;

  @media screen and (min-width: 1310px) {
    padding-top: 15px;
  }
`;

const Wrapper = styled.div`
  user-select: none;
  flex-direction: column;
  display: flex;
`;

const Decks = styled.div`
  display: flex;
`;

const TableWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export default App;
