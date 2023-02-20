import { memo } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { PlaybackStates } from "../../webaudio/deckWebAudio";
import { Loading } from "./Loading";

interface Props {
  playbackState: PlaybackStates;
  imageUrl?: string;
  loadingColor: string;
}

function AnimatedImageComponent({
  playbackState,
  loadingColor,
  imageUrl,
}: Props) {
  return (
    <Wrapper animated={playbackState === PlaybackStates.PLAYING}>
      <ColoredBorder>
        {playbackState !== PlaybackStates.EMPTY && (
          <ImageWrapper>
            {!!imageUrl && <Image src={imageUrl} />}
            <Loading
              isLoading={playbackState === PlaybackStates.LOADING}
              color={loadingColor}
            />
          </ImageWrapper>
        )}
      </ColoredBorder>
    </Wrapper>
  );
}

export const AnimatedImage = memo(AnimatedImageComponent);

const ColoredBorder = styled.div`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation-name: animation;
  animation-duration: 20s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-play-state: running;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: initial;
  background-color: black;
  box-sizing: border-box;

  @keyframes animation {
    0% {
      border: 2px dotted ${Colors.deckA};
    }
    50% {
      border: 2px dotted ${Colors.deckB};
    }
    100% {
      border: 2px dotted ${Colors.deckA};
    }
  }
`;

const Wrapper = styled.div<{
  animated: boolean;
}>`
  height: 75%;
  width: 75%;
  z-index: 5;
  animation-name: spinning;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: ${({ animated }) => (animated ? "running" : "paused")};

  @keyframes spinning {
    0% {
      transform: rotate(0turn);
    }
    100% {
      transform: rotate(1turn);
    }
  }
`;

const ImageWrapper = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: black;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
