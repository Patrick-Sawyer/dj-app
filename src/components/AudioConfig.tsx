import { Fragment, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS } from "../webaudio/deckWebAudio";
import { audioRouter, CONTEXT } from "../webaudio/webAudio";
import { EmbossedLabel } from "./EmbossedLabel";
import { HighlightedLabel } from "./HighlightedLabel";
import { NewKnob } from "./NewKnob/NewKnob";

interface Props {
  router: typeof audioRouter;
}

const channelsToString = (left: number) => {
  return `${left + 1} & ${left + 2}`;
};

export function AudioConfig({ router }: Props) {
  const [mainChannels, setMainChannels] = useState<number>(0);
  const [headphonesChannels, setHeadphonesChannels] = useState<number>(2);

  if (CONTEXT.destination.maxChannelCount < 4) {
    return null;
  }

  const changeChannels = (
    setChannels: {
      (nextLeft: number, nextRight: number): void;
      (arg0: number, arg1: number): void;
    },
    setChannelText: {
      (value: SetStateAction<number>): void;
      (arg0: number): void;
    },
    currentChannel: number
  ) => {
    if (CONTEXT.state === "suspended") CONTEXT.resume();
    const maxChannel = CONTEXT.destination.maxChannelCount;
    CONTEXT.destination.channelCount = maxChannel;
    const attempt = currentChannel + 2;
    const nextChannel = attempt < maxChannel ? attempt : 0;
    setChannelText(nextChannel);
    setChannels(nextChannel, nextChannel + 1);
  };

  return (
    <Wrapper>
      <EmbossedLabel text={"AUDIO CONFIG:"} />
      <Pair>
        <HighlightedLabel
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          text={"MAIN MIX:"}
          bold
        />
        <Text
          onPointerDown={() => {
            changeChannels(
              audioRouter.updateMainChannel,
              setMainChannels,
              mainChannels
            );
          }}
        >
          {channelsToString(mainChannels)}
        </Text>
      </Pair>
      <Pair>
        <HighlightedLabel
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          text={"CUE:"}
          bold
        />
        <Text
          onPointerDown={() => {
            changeChannels(
              audioRouter.updateCueChannel,
              setHeadphonesChannels,
              headphonesChannels
            );
          }}
        >
          {channelsToString(headphonesChannels)}
        </Text>
      </Pair>

      <Pair>
        <HighlightedLabel
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          text={"PHONES"}
          bold
        />
        <NewKnob
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          onChange={router.changeHeadphonesVolume}
          fromZero
          initValue={0}
        />
      </Pair>
      <Pair>
        <HighlightedLabel
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          text={"CUE / MIX"}
          bold
        />
        <NewKnob
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          onChange={router.setCueMix}
          debounceTime={100}
        />
      </Pair>
    </Wrapper>
  );
}

const Pair = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Text = styled.span`
  font-size: 13px;
  color: white;
  white-space: no-wrap;
  opacity: 0.5;
  transition: 0.1s;
  font-weight: 700;
  position: relative;
  min-width: 35px;
  bottom: 1px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.3;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1300px;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  padding: 0 5px;
  gap: 10px;
`;
