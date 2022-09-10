import styled from "styled-components";
import { Colors } from "../utils/theme";
import { TuneTableRow } from "./TuneTableRow";

interface Props {
  tunes: any[];
  deleteTrack: (index: number) => void;
}

export function TuneTable({ tunes, deleteTrack }: Props) {
  return (
    <Wrapper>
      <Head>
        <tr>
          {COLUMNS.map((column) => {
            return (
              <HeadCell key={column.name} width={column.width}>
                {column.name}
              </HeadCell>
            );
          })}
        </tr>
      </Head>
      <Body>
        {tunes.map((tune, index) => {
          return (
            <TuneTableRow
              deleteTrack={deleteTrack}
              tune={tune}
              key={index}
              index={index}
            />
          );
        })}
      </Body>
    </Wrapper>
  );
}

const Body = styled.tbody`
  height: 100%;
`;

const Wrapper = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  margin: 0 15px;
  max-width: 1309px;
`;
const Head = styled.thead`
  color: white;

  th:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

const HeadCell = styled.th<{
  width?: string;
}>`
  font-size: 11px;
  padding: 10px;
  font-weight: 600;
  ${({ width }) => width && `width: ${width};`}
  background: ${Colors.deckbGlow};
  animation-name: colors;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: running;

  @keyframes colors {
    0% {
      background: ${Colors.deckbGlow};
    }
    50% {
      background: ${Colors.deckAGlow};
    }
    100% {
      background: ${Colors.deckbGlow};
    }
  }
`;

const COLUMNS = [
  {
    name: "ARTIST",
    width: "30%",
  },
  {
    name: "TITLE",
    width: "40%",
  },
  {
    name: "GENRE",
    width: "7%",
  },
  {
    name: "BPM",
    width: "7%",
  },
  {
    name: "KEY",
    width: "7%",
  },
  {
    name: "BITRATE",
    width: "7%",
  },
  {
    name: "X",
  },
];
