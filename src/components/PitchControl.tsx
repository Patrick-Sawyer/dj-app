import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../utils/theme'
import { DECKS } from '../webaudio/deckWebAudio'
import { HighlightedLabel } from './HighlightedLabel'
import { PitchBackground } from './PitchBackground'
import { PitchSlider } from './PitchSlider'

interface Props {
  deck: typeof DECKS.deckA;
  setPitch: (pitch: number) => void;
  sensitivity: number;
  reverse?: boolean;
  color: string;
  lightOn: boolean;
  showSync: boolean;
  handleSync: () => void;
}

const SCROLL_LIMIT = 228

export function PitchControl ({
  deck,
  setPitch,
  sensitivity,
  reverse,
  color,
  lightOn,
  showSync,
  handleSync
}: Props) {
  const [offset, setOffset] = useState<number>(0)
  const mouseState = useRef({
    mouseDown: false,
    startPosition: 0,
    offsetAtStart: 0
  })

  const handleMouseDown = (e: any) => {
    mouseState.current.mouseDown = true
    mouseState.current.startPosition = e.pageY
    mouseState.current.offsetAtStart = offset
  }

  const handleMouseUp = (e: any) => {
    mouseState.current.mouseDown = false
    mouseState.current.startPosition = e.pageY
  }

  const handleMouseMove = (e: any) => {
    if (mouseState.current.mouseDown) {
      const diff = e.pageY - mouseState.current.startPosition
      const value = mouseState.current.offsetAtStart - diff
      const limited = value >= SCROLL_LIMIT ? SCROLL_LIMIT : value <= -SCROLL_LIMIT ? -SCROLL_LIMIT : value
      setOffset(limited)
    }
  }

  const reset = () => {
    mouseState.current.startPosition = 0
    mouseState.current.offsetAtStart = 0
    setOffset(0)
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleTrackClick = (isAbove: boolean) => {
    setOffset(isAbove ? offset + 1 : offset - 1 / devicePixelRatio)
  }

  useEffect(() => {
    const nextPitch = 1 - offset * sensitivity / SCROLL_LIMIT
    deck.setPlayBackSpeed(nextPitch)
    setPitch(nextPitch)
  }, [offset, sensitivity])

  return (
    <Wrapper reverse={reverse}>
      <Light reverse={reverse} color={color} lightOn={lightOn} />
      <Inner onMouseMove={handleMouseMove}>
        <PitchBackground reverse={reverse} offset={offset} onClick={handleTrackClick} />
        <PitchSlider
          offset={0 - offset}
          onMouseDown={handleMouseDown}
          reset={reset}
        />
      </Inner>
      {showSync && (
        <Sync onClick={handleSync}>
          <HighlightedLabel color={color} text={'SYNC'} />
        </Sync>
      )}
    </Wrapper>
  )
}

const Sync = styled.div`
  position: absolute;
  bottom: 10px;
  cursor: pointer;
`

const Wrapper = styled.div<{
  reverse?: boolean;
}>`
  align-items: center;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid ${Colors.darkBorder};
  box-sizing: border-box;
  ${({ reverse }) => reverse
? `
    padding-right: 15px;
    flex-direction: row-reverse;
    padding-left: 10px;
    border-right: 1px solid ${Colors.darkBorder};
    `
: `
  padding-left: 15px;
  padding-right: 10px;
  border-left: 1px solid ${Colors.darkBorder};
`}
`

const Inner = styled.div`
  height: 550px;
  width: 50px;
  justify-content: center;
  display: flex;
  align-items: center;
  position: relative;
`

const Light = styled.div<{
  color: string;
  reverse?: boolean;
  lightOn: boolean;
}>`
  border: 1px solid rgba(0,0,0,0.6);
  background-color: ${({ color }) => color};
  height: 8px;
  width: 8px;
  border-radius: 8px;
  box-shadow: 0px 0px 3px 0px ${({ color }) => color};
  position: relative;
  top: 1px;
  ${({ reverse }) => reverse ? 'left: 5px;' : 'right: 5px;'}
  opacity: ${({ lightOn }) => lightOn ? '1' : '0.2'};
`
