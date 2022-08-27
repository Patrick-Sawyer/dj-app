import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS, PlaybackStates } from "../webaudio/deckWebAudio";

interface Props {
  deck: typeof DECKS.deckA;
}

const calcLevel = (sampleBuffer: Float32Array) => {
  let peakInstantaneousPower = 0;
  for (let i = 0; i < sampleBuffer.length; i++) {
    const power = sampleBuffer[i] ** 2;
    peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
  }
  const logged = 10 * Math.log10(peakInstantaneousPower);
  const whatever = logged < -100 ? 0 : (logged + 100) / 70;
  return Math.floor(Math.pow(whatever, 10));
};

export function ChannelMeter({ deck }: Props) {
  const bufferLength = deck.audioAnalyser.fftSize;
  const data = useRef(new Float32Array(bufferLength));
  const [level, setLevel] = useState(0);

  const calculateAmplitude = () => {
    deck.audioAnalyser.getFloatTimeDomainData(data.current);
    const result = calcLevel(data.current);
    setLevel(result);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (deck.playbackState === PlaybackStates.PLAYING) {
        calculateAmplitude();
      } else {
        setLevel(0);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Wrapper>
      {new Array(30).fill(null).map((_, index) => {
        return <Light lightOn={level > index} red={index > 23} key={index} />;
      })}
    </Wrapper>
  );
}

const Light = styled.div<{
  lightOn: boolean;
  red: boolean;
}>`
  flex: 1;
  width: 100%;
  background-color: ${({ lightOn, red }) =>
    lightOn ? (red ? Colors.meterPeak : Colors.meter) : Colors.black};
  border-radius: 1px;
  box-shadow: inset 0px 0px 5px 0px #000000;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  padding: 7px;
  width: 100%;
  background-color: ${Colors.darkGreyBackground};
`;
