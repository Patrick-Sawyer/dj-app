export const CONTEXT = new AudioContext()
export const isFireFox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)

export const MAIN_VOLUME = CONTEXT.createGain()
MAIN_VOLUME.gain.value = 0.5
const MASTER_VOLUME = CONTEXT.createGain()
MASTER_VOLUME.gain.value = isFireFox ? 1 : 1.3
const MAIN_COMPRESSOR = CONTEXT.createDynamicsCompressor()
MAIN_VOLUME.connect(MASTER_VOLUME)
MASTER_VOLUME.connect(MAIN_COMPRESSOR)
// MAIN_COMPRESSOR.connect(CONTEXT.destination)
const SPLITTER = CONTEXT.createChannelSplitter(4)
MAIN_COMPRESSOR.connect(SPLITTER)
const MERGER = CONTEXT.createChannelMerger(CONTEXT.destination.maxChannelCount)
CONTEXT.destination.channelInterpretation = 'discrete'
SPLITTER.connect(MERGER, 0, 0)
SPLITTER.connect(MERGER, 1, 1)
MERGER.connect(CONTEXT.destination)

export const ZERO = 0.0001
export const FADE_IN_OUT_TIME = isFireFox ? 0.1 : 0.05

export const changeMasterVolume = (nextValue: number) => {
  MAIN_VOLUME.gain.cancelScheduledValues(0)
  const value = (nextValue + 50) / 100
  MAIN_VOLUME.gain.exponentialRampToValueAtTime(value < ZERO ? ZERO : value, CONTEXT.currentTime + FADE_IN_OUT_TIME)
}
