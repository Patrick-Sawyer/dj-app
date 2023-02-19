import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Colors } from "../utils/theme";
import { debouncer } from "./Deck";
import { EmbossedLabel } from "./EmbossedLabel";

interface Props {
  onChange: (value: number) => void;
  text?: string;
}

export function Slider({ onChange, text }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  const debounced = debouncer(onChange)

  useEffect(() => {
    if (ref.current) {
      const color = 191 + (50 + value) * 1.26;
      ref.current.style.setProperty(
        "--SliderColor",
        `hsl(${color}, 100%, 50%)`
      );
    }
    debounced(value);
  }, [value]);

  return (
    <Wrapper>
      {!!text && <EmbossedLabel text={text} />}
      <Input
        ref={ref}
        type="range"
        min="-50"
        value={value}
        onChange={handleChange}
        max="50"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input<{
  vertical?: boolean;
}>`
  width: 100%;
  margin: 20px;
  background-color: transparent;
  -webkit-appearance: none;
  --SliderColor: hsl(254, 100%, 50%);

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background: ${Colors.darkGreyBackground};
    border: 1px solid ${Colors.darkBorder};
    border-radius: 4px;
    width: 100%;
    height: 10px;
    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    margin-top: -25px;
    width: 25px;
    height: 60px;
    background: ${Colors.knobBackground};
    border: 1px solid var(--SliderColor);
    border-radius: 1px;
    cursor: pointer;
    -webkit-appearance: none;
    box-shadow: inset 0px -6px 11px -2px ${Colors.dirtyBrown};

    @media screen and (pointer: coarse) {
      width: 40px;
      border-radius: 7px;
    }
  }

  &:focus::-webkit-slider-runnable-track {
    background: #NaNNaNNaN;
  }

  &::-moz-range-track {
    background: ${Colors.darkGreyBackground};
    border: 1px solid ${Colors.darkBorder};
    border-radius: 4px;
    width: 100%;
    height: 10px;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 60px;
    background: ${Colors.knobBackground};
    border-radius: 1px;
    border: 1.5px solid var(--SliderColor);
    cursor: pointer;
    box-shadow: inset 0px -6px 11px -2px ${Colors.dirtyBrown};

    @media screen and (pointer: coarse) {
      width: 40px;
      border-radius: 7px;
    }
  }
`;
