import { Fragment, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { DECKS } from "../webaudio/deckWebAudio";
import { audioRouter, CONTEXT } from "../webaudio/webAudio";
import { EmbossedLabel } from "./EmbossedLabel";
import { HighlightedLabel } from "./HighlightedLabel";
import { Knob } from "./Knob";

interface Props {
  decks: typeof DECKS;
  router: typeof audioRouter;
}

const channelsToString = (left: number) => {
  return `${left + 1} & ${left + 2}`;
};

export function AudioConfig({ decks, router }: Props) {
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
    <Fragment>
      <EmbossedLabel text={"AUDIO:"} />
      <Pair>
        <HighlightedLabel
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          text={"MAIN:"}
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
          text={"PHONES:"}
        />{" "}
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
          text={"VOL"}
        />
        <Knob
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
        />
        <Knob
          color={Colors.orange}
          glowColor={Colors.orangeGlow}
          onChange={router.setCueMix}
        />
      </Pair>
    </Fragment>
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
  opacity: 0.3;
  transition: 0.1s;
  font-weight: 300;
  position: relative;
  min-width: 35px;
  bottom: 1px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.3;
  }
`;
