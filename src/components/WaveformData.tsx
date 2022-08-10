import React, { Fragment, useEffect, useRef } from 'react'

interface Props {
  data?: number[];
  color: string;
  zoom: number;
}

const WAVEFORM_HEIGHT = 50

const drawLineSegment = (ctx: CanvasRenderingContext2D, x: number, value: number, color: string) => {
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(x + 0.5, WAVEFORM_HEIGHT - (1 - value) * WAVEFORM_HEIGHT / 2 + 0.5)
  ctx.lineTo(x + 0.5, (1 - value) * WAVEFORM_HEIGHT / 2 + 0.5)
  ctx.stroke()
}

function WaveformDataSegmentComponent ({ data, color, zoom }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  const draw = (normalizedData: number[]) => {
    if (!ref.current || !normalizedData) return
    ref.current.width = normalizedData?.length
    ref.current.height = WAVEFORM_HEIGHT
    ref.current.style.width = normalizedData.length / devicePixelRatio + 'px'
    ref.current.style.height = WAVEFORM_HEIGHT + 'px'
    const ctx = ref.current.getContext('2d')
    if (!ctx) return
    normalizedData.forEach((value, index) => {
      drawLineSegment(ctx, index, value, color)
    })
  }

  useEffect(() => {
    const zoomedData = data ? filter(data, zoom) : []
    draw(zoomedData || [])
  }, [data, zoom])

  return (
    <canvas ref={ref} />
  )
}

const filter = (data: number[], zoom: number) => {
  const length = Math.floor(data.length / zoom)
  const batch = Math.floor(data.length / length)
  const result = new Array(length)
  for (let i = 0; i < length; i++) {
    let sum = 0
    for (let j = 0; j < batch; j++) {
      sum += data[i * batch + j]
    }
    result[i] = sum / batch
  }
  return result
}

export const WaveformDataSegment = React.memo(WaveformDataSegmentComponent)

const WaveformDataComponent = ({ data, color, zoom }: Props) => {
  return (
    <Fragment>
      {splitData(data).map((segment, index) => {
        return (
          <WaveformDataSegment data={segment} key={index} color={color} zoom={zoom}/>
        )
      })}
    </Fragment>
  )
}

const WAVEFORM_MAX_LENGTH = 10000

const splitData = (data?: number[]) => {
  if (!data) return []
  const numberOfWaveforms = Math.ceil(data.length / WAVEFORM_MAX_LENGTH)
  const dataToReturn = new Array(numberOfWaveforms)

  for (let i = 0; i < numberOfWaveforms; i++) {
    dataToReturn[i] = data.slice(i * WAVEFORM_MAX_LENGTH, (i + 1) * WAVEFORM_MAX_LENGTH)
  }

  return dataToReturn
}

export const WaveFormData = React.memo(WaveformDataComponent)
