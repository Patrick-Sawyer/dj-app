import "./App.css";
import styled from "styled-components";
import { useState } from "react";
import { TuneTable } from "./components/Home/TuneTable";
import { Mixer } from "./components/Mixer/Mixer";
import { Colors } from "./utils/theme";
import { DECKS } from "./webaudio/deckWebAudio";
import { FX } from "./components/Effects/FX";
import { AudioConfig } from "./components/Home/AudioConfig";
import { audioRouter } from "./webaudio/webAudio";
import * as musicMetadata from "music-metadata-browser";
import { DropZone } from "./components/Home/Dropzone";
import { Blurb } from "./components/Home/Blurb";
import { Deck } from "./components/Deck/Deck";

window.Buffer = window.Buffer || require("buffer").Buffer;
window.process = window.process || require("process");

export interface TuneMetaDataTableColumns {
  artist?: string;
  title?: string;
  genre?: string;
  bitrate?: string;
  bpm?: string;
  key?: string;
}
export interface TuneMetaData extends TuneMetaDataTableColumns {
  image?: musicMetadata.IPicture;
}

export interface TuneData extends TuneMetaData {
  blob?: any;
  reactKey: string;
}

export interface DeckType {}

function App() {
  const [tunes, setTunes] = useState<TuneData[]>([]);
  const [tunesLoading, setTunesLoading] = useState(false);
  const [deckApitch, setDeckAPitch] = useState(1);
  const [deckAInitBpm, setDeckAInitBpm] = useState<number>();
  const [deckBInitBpm, setDeckBInitBpm] = useState<number>();
  const [deckBpitch, setDeckBPitch] = useState(1);

  const deleteTrack = (reactKeyToDelete: string) => {
    const newTunes = [...tunes].filter(
      ({ reactKey }) => reactKey !== reactKeyToDelete
    );
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
            setPitch={setDeckAPitch}
            setBpm={setDeckAInitBpm}
          />
          <Mixer router={audioRouter} decks={DECKS} />
          <Deck
            deck={DECKS.deckB}
            color={Colors.deckB}
            glowColor={Colors.deckbGlow}
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
      </Wrapper>
      <AudioConfig router={audioRouter} />
      <DropZone
        tunes={tunes}
        setTunes={setTunes}
        setTunesLoading={setTunesLoading}
        tunesLoading={tunesLoading}
      />
      <TableWrapper>
        <TuneTable
          loading={tunesLoading}
          deleteTrack={deleteTrack}
          tunes={tunes}
        />
      </TableWrapper>
      <Blurb />
    </Outer>
  );
}

const Outer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 750px;
  background-color: ${Colors.mainBackground};
  padding-bottom: 500px;
  overflow: hidden;

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
