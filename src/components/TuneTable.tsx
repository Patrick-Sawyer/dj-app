import { useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { TuneTableRow } from "./TuneTableRow";

interface Props {
  tunes: any[];
  deleteTrack: (index: number) => void;
}

const columnFields = [ 'artist', 'title', 'genre', 'bpm', 'key', 'bitrate'];

export function TuneTable({ tunes, deleteTrack }: Props) {

  const [sortType, setSortType] = useState<{index: number; down: boolean;}>();

  const handleSort = (index: number) => {
    if(sortType?.index === index){
      setSortType({
        index,
        down: !sortType.down,
      })
    } else {
      setSortType({
        index,
        down: false
      })
    }
  }

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
        {tunes.sort((a, b) => {
          if(!sortType) return 0;
          const field = columnFields[sortType.index];
          const first = a[field]?.toString();
          const second = b[field]?.toString();
          console.log(a, b);
          if(first && second) {
            return sortType.down ? first.localeCompare(second) : second.localeCompare(first)
          }
          
          return 0;
        }).map((tune, index) => {
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

const Arrow = styled.div<{
  down?: boolean;
}>`
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid ${Colors.white};

  ${({down}) => !!down && 'transform: scaleY(-1);'}

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
  }
`;

const HeadCellContent = styled.div`
  display: flex;
  height: 100%;
  gap: 15px;
  align-items: center;

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
