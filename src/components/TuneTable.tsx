import { useState } from "react";
import styled from "styled-components";
import { TuneData, TuneMetaData, TuneMetaDataTableColumns } from "../App";
import { Colors } from "../utils/theme";
import { TuneTableRow } from "./TuneTableRow";

interface Props {
  tunes: TuneData[];
  deleteTrack: (reactKey: string) => void;
}

const columnFields: Array<keyof TuneMetaDataTableColumns> = [ 'artist', 'title', 'genre', 'bpm', 'key', 'bitrate'];

export function TuneTable({ tunes, deleteTrack }: Props) {
  const [sortType, setSortType] = useState<{index: number; down: boolean;}>();

  const handleSort = (index: number) => {
    if(sortType?.index === index){
      if(sortType.down === false) {
        setSortType({
          index,
          down: true,
        })
      } else {
        setSortType(undefined)
      }
    } else {
      setSortType({
        index,
        down: false
      })
    }
  }

  const copyOfTunes = [...tunes];

  const sorted = copyOfTunes.sort((a, b) => {
    if(!sortType) return 0;
    const field = columnFields[sortType.index];
    const first = a[field];
    const second = b[field];

    if(first && second) {
      return sortType.down ? first.localeCompare(second) : second.localeCompare(first);
    }

    return 0;
  });

  const tunesToShow = sortType ? sorted : tunes;

  return (
    <Wrapper>
      <Head>
        <tr>
          {COLUMNS.map((column, index) => {
            return (
              <HeadCell key={column.name} width={column.width} onClick={() => {
                handleSort(index)
              }}>
                <HeadCellContent>
                  {column.name}{sortType?.index === index ? <Arrow down={sortType.down} /> : null}
                </HeadCellContent>
              </HeadCell>
            );
          })}
        </tr>
      </Head>
      <Body>
        {tunesToShow.map((tune) => {
          return (
            <TuneTableRow
              deleteTrack={deleteTrack}
              key={tune.reactKey}
              data={tune}
            />
          );
        })}
      </Body>
    </Wrapper>
  );
}

const Arrow = styled.div<{
  down?: boolean;
}>`
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid ${Colors.white};

  ${({down}) => !down && 'transform: scaleY(-1);'}

`

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
  cursor: pointer;
  th:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    min-width: 70px;
  }
`;

const HeadCellContent = styled.div`
  display: flex;
  height: 100%;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`

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
