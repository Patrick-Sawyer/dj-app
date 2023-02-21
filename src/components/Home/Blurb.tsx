import { memo } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";

const BlurbComponent = () => {
  return (
    <Wrapper>
      <Question>{"How does it work?"}</Question>
      <Text>
        {
          "This DJ App has been designed so you can upload any of your own audio tracks and mix them online. It will work with most common audio formats."
        }
      </Text>
      <Text>
        {
          "Click the uplpoad button to upload tracks, then double click on the track in the list to load it into an empty deck."
        }
      </Text>
      <Question>{"Can I use headphones?"}</Question>
      <Text>
        {
          "You will need a 4 channel audio setup to be able to have a separate headphones output. On launch, the app checks how many audio outputs are available and configures the app accordingly. If you add a sound card with 4 or more audio tracks and refresh the browser you will see cue / headphones controls and an audio config."
        }
      </Text>
      <Question>{"Will it work on all devices?"}</Question>
      <Text>
        {
          "This has been optimised for use in Chrome on a desktop / laptop. Other devices & browsers may not work as well."
        }
      </Text>
      <Question>{"Online synth"}</Question>
      <Text>
        {`While you're here, why don't you check out our `}
        <Link
          target="_blank"
          href="https://www.disco-computer.com/synthesizer/synth.html"
        >
          {"online synth"}
        </Link>
        {` too.`}
      </Text>
      <Question>{"Developer"}</Question>
      <Text>
        {`This app was created by `}
        <Link
          target="_blank"
          href="https://www.linkedin.com/in/patrickrobertsawyer/"
        >
          {"Patrick Sawyer"}
        </Link>
        {"."}
      </Text>
    </Wrapper>
  );
};

const Text = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  text-align: left;
  padding: 0 15px;
`;

const Question = styled.p`
  color: ${Colors.white};
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  padding: 0 15px;
  opacity: 0.9;
`;

const Wrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  max-width: 1340px;
`;

const Link = styled.a`
  text-decoration: underline;

  appearance: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);

  :hover {
    color: ${Colors.deckA};
  }

  :active {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const Blurb = memo(BlurbComponent);
