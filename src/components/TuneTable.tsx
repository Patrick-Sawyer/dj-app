import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { TuneData, TuneMetaData, TuneMetaDataTableColumns } from "../App";
import { Colors } from "../utils/theme";
import { TuneTableRow } from "./TuneTableRow";

interface Props {
  tunes: TuneData[];
  deleteTrack: (reactKey: string) => void;
  loading: boolean;
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const columnFields: Array<keyof TuneMetaDataTableColumns> = [
  "artist",
  "title",
  "genre",
  "bpm",
  "key",
  "bitrate",
];

export function TuneTable({
  tunes,
  deleteTrack,
  loading,
  handleUpload,
}: Props) {
  const [sortType, setSortType] = useState<
    { index: number; down: boolean } | undefined
  >({
    index: 0,
    down: false,
  });

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
                  {sortType?.index === index && index < COLUMNS.length - 1 ? (
                    <Arrow down={sortType.down} />
                  ) : null}
                </HeadCellContent>
              </HeadCell>
            );
          })}
        </tr>
      </Head>
      <Body>
        {tunesToShow.length ? (
          tunesToShow.map((tune) => {
            return (
              <TuneTableRow
                deleteTrack={deleteTrack}
                key={tune.reactKey}
                data={tune}
              />
            );
          })
        ) : loading ? (
          <TuneTableRow
            key="loading"
            data={{
              artist: "Loading...",
              title: "Loading...",
              reactKey: "Loading",
              bpm: "...",
              bitrate: "...",
              key: "...",
              genre: "...",
            }}
          />
        ) : (
          <TuneTableRow
            deleteTrack={deleteTrack}
            handleUpload={handleUpload}
            key={"no-tunes"}
            data={{
              artist: "Upload some tracks...",
              title: "Upload some tracks...",
              reactKey: "upload-some-tracks",
              bpm: "...",
              bitrate: "...",
              key: "...",
              genre: "...",
            }}
          />
        )}
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
  cursor: pointer;
  th:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    min-width: 70px;
  }

  th {
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
    name: "",
  },
];
