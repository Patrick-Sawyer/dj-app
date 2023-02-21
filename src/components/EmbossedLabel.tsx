import styled from "styled-components";
import { Colors } from "../utils/theme";

interface Props {
  text: string;
  fontSize?: string;
  hideOnSmallScreen?: boolean;
}

export function EmbossedLabel({
  text,
  fontSize = "13px",
  hideOnSmallScreen = false,
}: Props) {
  return (
    <Text hide={hideOnSmallScreen} fontSize={fontSize}>
      {text}
    </Text>
  );
}

const Text = styled.span<{
  fontSize?: string;
  hide: boolean;
}>`
  font-size: ${(props) => props.fontSize || "13px"};
  text-shadow: 0px 1px 1px #5a5654;
  color: #090909;
  font-weight: 500;
  white-space: no-wrap;

  ${({ hide }) =>
    hide &&
    `
    @media screen and (max-width: 1000px) {
      display: none;
    }
  `}
`;
