import { memo } from "react";
import styled from "styled-components";
import { TuneMetaData } from "../../App";
import { Ellipsis } from "../Ellipsis";

interface ArtistProps {
  duration?: number;
  color: string;
  artist: string;
}

function ArtistComponent({ duration, color, artist }: ArtistProps) {
  const durationString = getTimeAsString(duration);

  return (
    <Row>
      <Cell opacity={0.9} color={color}>
        {"Artist:"}
      </Cell>
      <Cell bold width={"100%"}>
        <Ellipsis>{artist}</Ellipsis>
      </Cell>
      <Cell opacity={0.9} color={color} hideOnSmallScreen>
        {"Dur:"}
      </Cell>
      <Cell
        opacity={duration ? 1 : "0"}
        digital
        width={"100%"}
        fontSize={"14px"}
        textAlign={"right"}
        hideOnSmallScreen
      >
        {durationString}
      </Cell>
    </Row>
  );
}

const Artist = memo(ArtistComponent);

interface TitleProps {
  color: string;
  title: string;
}

function TitleComponent({ color, title }: TitleProps) {
  return (
    <>
      <Cell opacity={0.9} color={color}>
        {"Title:"}
      </Cell>
      <Cell bold width={"100%"}>
        <Ellipsis>{title}</Ellipsis>
      </Cell>
      <Cell opacity={0.9} color={color} hideOnSmallScreen>
        {"Pos:"}
      </Cell>
    </>
  );
}

const Title = memo(TitleComponent);

export function TrackInfo({
  artist = "",
  title = "",
  duration,
  color,
  position,
}: TuneMetaData & {
  duration?: number;
  color: string;
  position: number;
}) {
  const positionString = getTimeAsString(position * (duration || 0));

  return (
    <Wrapper>
      <Body>
        <Artist duration={duration} color={color} artist={artist} />
        <Row>
          <Title color={color} title={title} />
          <Cell
            opacity={position && duration ? 1 : "0"}
            hideOnSmallScreen
            digital
            width={"100%"}
            fontSize={"14px"}
            textAlign={"right"}
          >
            {positionString}
          </Cell>
        </Row>
      </Body>
    </Wrapper>
  );
}

const getTimeAsString = (duration: number | undefined): string => {
  if (!duration) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  const leadingZeroSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${leadingZeroSeconds}`;
};

const Wrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
  margin: 8px;

  @media screen and (max-width: 1000px) {
    margin: 8px 0;
  }
`;

const Body = styled.tbody``;

const Row = styled.tr``;

const Cell = styled.td<{
  bold?: boolean;
  color?: string;
  opacity?: number | string;
  textAlign?: string;
  monospace?: boolean;
  digital?: boolean;
  fontSize?: string;
  hideOnSmallScreen?: boolean;
}>`
  padding-right: 20px;
  font-size: ${({ fontSize }) => fontSize || "12px"};
  font-weight: 600;
  ${({ digital }) => digital && 'font-family: "Digital";'}
  color: ${({ color }) => color || "white"};
  ${({ opacity }) => opacity && `opacity: ${opacity};`}
  ${({ monospace }) => monospace && "font-family: monospace, monospace;"}
  ${({ textAlign }) => textAlign && `text-align: ${textAlign};`}

  @media screen and (max-width: 1000px) {
    padding-right: 10px;
  }

  ${({ hideOnSmallScreen }) =>
    !!hideOnSmallScreen &&
    `
    @media screen and (max-width: 1000px) {
      display: none;
    }
  `}
`;
