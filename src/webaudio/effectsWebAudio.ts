import { DECKS } from './deckWebAudio'
import { CONTEXT, FADE_IN_OUT_TIME, isFireFox, MAIN_VOLUME, ZERO } from './webAudio'

const DELAY_CHANGE_TIME = 0.01

const addReverb = async (convolver: ConvolverNode) => {
  const response = await fetch('/audio/hall.wav')
  const arraybuffer = await response.arrayBuffer()
  const buffer = await CONTEXT.decodeAudioData(arraybuffer)
  convolver.buffer = buffer
}

const handleTap = (delay: DelayNode) => {
  let lastTap: number | null = null
  return () => {
    const now = new Date().getTime()
    if (lastTap) {
      const time = (now - lastTap) / 1000

      if (time < 5) {
        !isFireFox && delay.delayTime.cancelAndHoldAtTime(CONTEXT.currentTime)
        delay.delayTime.linearRampToValueAtTime(time, CONTEXT.currentTime + DELAY_CHANGE_TIME)
      }
    }
    lastTap = now
  }
}

export class Effects {
  deckAInput: GainNode
  deckBInput: GainNode
  wet: GainNode
  dry: GainNode
  dryWet: GainNode
  changeDryWet: (value: number) => void
  delay: DelayNode
  feedback: GainNode
  changeFeedback: (value: number) => void
  handleTap: () => void
  handleX2: () => void
  feedbackCompressor: DynamicsCompressorNode
  output: DynamicsCompressorNode
  changeDeckAInput: (value: number) => void
  changeDeckBInput: (value: number) => void
  reverb: ConvolverNode
  reverbVolume: GainNode
  changeReverb: (value: number) => void
  setDelayTime: (delayTime: number) => void

  constructor () {
    this.reverb = CONTEXT.createConvolver()
    addReverb(this.reverb)
    this.deckAInput = CONTEXT.createGain()
    this.deckAInput.gain.value = 0
    this.deckBInput = CONTEXT.createGain()
    this.deckBInput.gain.value = 0
    this.wet = CONTEXT.createGain()
    this.wet.gain.value = 0
    this.dry = CONTEXT.createGain()
    this.dry.gain.value = 1
    this.delay = CONTEXT.createDelay(10)
    this.feedback = CONTEXT.createGain()
    this.feedback.gain.value = 0
    this.deckAInput.connect(this.delay)
    this.deckBInput.connect(this.delay)
    this.delay.connect(this.feedback)
    this.delay.delayTime.value = 0.5
    this.feedbackCompressor = CONTEXT.createDynamicsCompressor()
    this.feedback.connect(this.delay)
    this.dryWet = CONTEXT.createGain()
    this.wet.connect(this.dryWet)
    this.feedback.connect(this.wet)
    this.dry.connect(this.dryWet)
    this.output = CONTEXT.createDynamicsCompressor()
    this.dryWet.connect(this.output)
    this.reverbVolume = CONTEXT.createGain()
    this.reverbVolume.gain.value = 0
    this.deckAInput.connect(this.reverb)
    this.deckBInput.connect(this.reverb)
    this.reverb.connect(this.reverbVolume)
    this.reverbVolume.connect(this.wet)
    this.changeFeedback = (value: number) => {
      const nextValue = limit((value + 50) / 101)
      this.feedback.gain.cancelScheduledValues(CONTEXT.currentTime)
      this.feedback.gain.linearRampToValueAtTime(nextValue, CONTEXT.currentTime + FADE_IN_OUT_TIME)
    }
    this.changeDryWet = (value: number) => {
      const nextValue = (value + 50) / 100
      const wetValue = limit(Math.sqrt(nextValue))
      const dryValue = limit(Math.sqrt(1 - nextValue))
      this.dry.gain.value = dryValue
      this.wet.gain.value = wetValue
    }
    this.handleX2 = () => {
      const { value } = this.delay.delayTime
      !isFireFox && this.delay.delayTime.cancelAndHoldAtTime(CONTEXT.currentTime)
      this.delay.delayTime.linearRampToValueAtTime(value / 2, CONTEXT.currentTime + DELAY_CHANGE_TIME)
    }
    this.setDelayTime = (delayTime: number) => {
      !isFireFox && this.delay.delayTime.cancelAndHoldAtTime(CONTEXT.currentTime)
      this.delay.delayTime.linearRampToValueAtTime(delayTime, CONTEXT.currentTime + DELAY_CHANGE_TIME)
    }
    this.handleTap = handleTap(this.delay)
    this.changeDeckAInput = (value: number) => {
      const nextValue = limit((value + 50) / 100)
      this.deckAInput.gain.cancelScheduledValues(CONTEXT.currentTime)
      this.deckAInput.gain.linearRampToValueAtTime(nextValue, CONTEXT.currentTime + FADE_IN_OUT_TIME)
    }
    this.changeDeckBInput = (value: number) => {
      const nextValue = limit((value + 50) / 100)
      this.deckBInput.gain.cancelScheduledValues(CONTEXT.currentTime)
      this.deckBInput.gain.linearRampToValueAtTime(nextValue, CONTEXT.currentTime + FADE_IN_OUT_TIME)
    }
    this.changeReverb = (value: number) => {
      const nextValue = limit((value + 50) / 150)
      this.reverbVolume.gain.cancelScheduledValues(CONTEXT.currentTime)
      this.reverbVolume.gain.linearRampToValueAtTime(nextValue, CONTEXT.currentTime + FADE_IN_OUT_TIME)
    }
  }
}

export const EFFECTS = new Effects()

DECKS.deckA.gainNode.connect(EFFECTS.deckAInput)
DECKS.deckB.gainNode.connect(EFFECTS.deckBInput)
EFFECTS.output.connect(MAIN_VOLUME)
DECKS.deckA.gainNode.connect(EFFECTS.dry)
DECKS.deckB.gainNode.connect(EFFECTS.dry)

const limit = (value: number) => {
  return value < ZERO ? ZERO : value
}
