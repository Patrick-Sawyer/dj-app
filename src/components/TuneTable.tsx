import { ChangeEvent, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { TuneData, TuneMetaData, TuneMetaDataTableColumns } from "../App";
import { Colors } from "../utils/theme";
import { TuneTableRow } from "./TuneTableRow";

interface Props {
  tunes: TuneData[];
  deleteTrack: (reactKey: string) => void;
  loading: boolean;
}

const columnFields: Array<keyof TuneMetaDataTableColumns> = [
  "artist",
  "title",
  "genre",
  "bpm",
  "key",
  "bitrate",
];

interface Sort {
  index: number;
  down: boolean;
}

interface HeaderProps {
  sortType?: Sort;
  setSortType: (sort?: Sort) => void;
}

function TableHeader({ sortType, setSortType }: HeaderProps) {
  const handleSort = (index: number) => {
    if (sortType?.index === index) {
      if (sortType.down === false) {
        setSortType({
          index,
          down: true,
        });
      } else {
        setSortType(undefined);
      }
    } else {
      setSortType({
        index,
        down: false,
      });
    }
  };

  return (
    <Head>
      <tr>
        {COLUMNS.map((column, index) => {
          return (
            <HeadCell
              hideBelow={index === 5 ? 1000 : undefined}
              key={column.name}
              width={column.width}
              onClick={() => {
                if (index < COLUMNS.length - 1) handleSort(index);
              }}
            >
              <HeadCellContent>
                {column.name}
                {sortType?.index === index ? (
                  <Arrow down={sortType.down} />
                ) : null}
              </HeadCellContent>
            </HeadCell>
          );
        })}
      </tr>
    </Head>
  );
}

const Header = memo(TableHeader);

export function TuneTable({ tunes, deleteTrack, loading }: Props) {
  const [sortType, setSortType] = useState<Sort | undefined>({
    index: 0,
    down: false,
  });

  const copyOfTunes = [...tunes];

  const sorted = copyOfTunes.sort((a, b) => {
    if (!sortType) return 0;
    const field = columnFields[sortType.index];
    const first = a[field];
    const second = b[field];

    if (first && second) {
      return sortType.down
        ? second.localeCompare(first, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        : first.localeCompare(second, undefined, {
            numeric: true,
            sensitivity: "base",
          });
    }

    return 0;
  });

  const tunesToShow = sortType ? sorted : tunes;

  return (
    <Wrapper>
      <Header sortType={sortType} setSortType={setSortType} />
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

  ${({ down }) => !down && "transform: scaleY(-1);"}
`;

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
    min-width: 70px;
    cursor: pointer;
  }

  border-bottom: 2px solid ${Colors.mainBackground};

  th:not(:last-child) {
    border-right: 2px solid ${Colors.mainBackground};
  }

  th:last-child {
    min-width: 15px;
  }
`;

const HeadCellContent = styled.div`
  display: flex;
  height: 100%;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const HeadCell = styled.th<{
  width?: string;
  hideBelow?: number;
}>`
  font-size: 11px;
  opacity: 0.9;
  background: #151515;
  border-radius: 3px;
  padding: 10px;
  font-weight: 600;
  ${({ width }) => width && `width: ${width};`}

  ${({ hideBelow }) =>
    !!hideBelow &&
    `
    @media screen and (max-width: ${hideBelow}px) {
      display: none;
    }
  `}
`;

const COLUMNS = [
  {
    name: "Artist",
    width: "30%",
  },
  {
    name: "Title",
    width: "40%",
  },
  {
    name: "Genre",
    width: "15%",
  },
  {
    name: "BPM",
    width: "5%",
  },
  {
    name: "Key",
    width: "5%",
  },
  {
    name: "Bitrate",
    width: "5%",
  },
  {
    name: "",
  },
];
