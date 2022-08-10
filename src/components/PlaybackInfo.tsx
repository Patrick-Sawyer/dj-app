import styled from 'styled-components'

interface Props {
  speed: number;
}

export function PlaybackInfo ({ speed }: Props) {
  const speedTo2Chars = speed.toFixed(2)

  return (
    <Wrapper>
      {speed > 0 ? '+' + speedTo2Chars : speedTo2Chars}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  font-size: 18px;
  font-weight: bold;
  line-height: 40px;
  color: white;
`
