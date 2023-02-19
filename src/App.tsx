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
import * as musicMetadata from "music-metadata-browser";

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
  const [tunes, setTunes] = useState<any[]>([]);
  const [deckApitch, setDeckAPitch] = useState(1);
  const [deckAInitBpm, setDeckAInitBpm] = useState<number>();
  const [deckBInitBpm, setDeckBInitBpm] = useState<number>();
  const [deckBpitch, setDeckBPitch] = useState(1);

  const deleteTrack = (reactKeyToDelete: string) => {
    const newTunes = [...tunes].filter(({reactKey}) => reactKey !== reactKeyToDelete);
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
          <Upload setTunes={setTunes} tunes={tunes} />
          <AudioConfig decks={DECKS} router={audioRouter} />
        </ConfigAndUpload>
      </Wrapper>
      <TableWrapper>
        <TuneTable deleteTrack={deleteTrack} tunes={tunes} />
      </TableWrapper>
      <Blurb>
        <BlurbHeader>
          {"How does it work?"}
        </BlurbHeader>
        <BlurbText>
          {"This DJ App has been designed so you can upload any of your own audio tracks and mix them online. It will work with most common audio formats."}
        </BlurbText>
        <BlurbText>
          {"Click the uplpoad button to upload tracks, then click on the track in the list to load it into an empty deck."}
        </BlurbText>
        <BlurbHeader>
          {"Can I use headphones?"}
        </BlurbHeader>
        <BlurbText>
          {"You will need a 4 channel audio setup to be able to have a separate headphones output. On launch, the app checks how many audio outputs are available and configures the app accordingly. If you add a sound card with 4 or more audio tracks and refresh the browser you will see cue / headphones controls and an audio config."}
        </BlurbText>
        <BlurbHeader>
          {"Will it work on all devices?"}
        </BlurbHeader>
        <BlurbText>
          {"This has been optimised for use in Chrome on a desktop / laptop. Other devices & browsers may not work as well."}
        </BlurbText>
        <BlurbHeader>
          {"Online synth"}
        </BlurbHeader>
        <BlurbText>
          {`While you're here, why don't you check out our `}<Link target="_blank" href="https://www.disco-computer.com/synthesizer/synth.html">{"online synth"}</Link>{` too.`}
        </BlurbText>
        <BlurbHeader>
          {"Developer"}
        </BlurbHeader>
        <BlurbText>
          {`This app was created by `}<Link target="_blank" href="https://www.linkedin.com/in/patrickrobertsawyer/">{"Patrick Sawyer"}</Link>{"."}
        </BlurbText>
      </Blurb>
    </Outer>
  );
}

const Link = styled.a`
  text-decoration: underline;
  appearence: none;
  cursor: pointer;
  color ${Colors.white};

  :hover {
    color ${Colors.deckA};
  }
  
  :active {
    color ${Colors.white};
  }
`

const BlurbText = styled.p`
  color: ${Colors.white};
  font-size: 13px;
  font-weight: 500;
  opacity: 0.6;
  text-align: left;
  padding: 0 15px;
`

const BlurbHeader = styled.p`
  color: ${Colors.white};
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  padding: 0 15px;
`

const Blurb = styled.div`
  width: 100%;
  max-width: 1340px;
`

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
