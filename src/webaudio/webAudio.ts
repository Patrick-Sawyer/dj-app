export const CONTEXT = new AudioContext();

export const isFireFox =
  window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);

export const MAIN_VOLUME = CONTEXT.createGain();
MAIN_VOLUME.gain.value = 0.5;
const MASTER_VOLUME = CONTEXT.createGain();
MASTER_VOLUME.gain.value = isFireFox ? 1 : 1.3;
export const MAIN_COMPRESSOR = CONTEXT.createDynamicsCompressor();
MAIN_VOLUME.connect(MASTER_VOLUME);
MASTER_VOLUME.connect(MAIN_COMPRESSOR);

export const ZERO = 0.0001;
export const FADE_IN_OUT_TIME = isFireFox ? 0.1 : 0.05;

export const changeMasterVolume = (nextValue: number) => {
  MAIN_VOLUME.gain.cancelScheduledValues(0);
  const value = (nextValue + 50) / 100;
  MAIN_VOLUME.gain.exponentialRampToValueAtTime(
    value < ZERO ? ZERO : value,
    CONTEXT.currentTime + FADE_IN_OUT_TIME
  );
};

class AudioRouter {
  cueInput: GainNode;
  mainInput: GainNode;
  cueVolume: GainNode;
  cueMixVolume: GainNode;
  setCueMix: (value: number) => void;
  audioMerger: ChannelMergerNode;
  mainSplitter: ChannelSplitterNode;
  cueSplitter: ChannelSplitterNode;
  updateCueChannel: (nextLeft: number, nextRight: number) => void;
  updateMainChannel: (nextLeft: number, nextRight: number) => void;
  deckA: GainNode;
  deckB: GainNode;
  headphonesVolume: GainNode;
  changeHeadphonesVolume: (value: number) => void;

  constructor() {
    this.deckA = CONTEXT.createGain();
    this.deckA.gain.value = 0;
    this.deckB = CONTEXT.createGain();
    this.deckB.gain.value = 0;
    this.cueInput = CONTEXT.createGain();
    this.deckA.connect(this.cueInput);
    this.deckB.connect(this.cueInput);
    this.mainInput = CONTEXT.createGain();
    this.mainInput.gain.value = 1;
    this.cueInput.gain.value = 1;
    this.cueVolume = CONTEXT.createGain();
    this.cueVolume.gain.value = 1;
    this.cueInput.connect(this.cueVolume);
    this.cueMixVolume = CONTEXT.createGain();
    this.cueMixVolume.gain.value = 0;

    this.setCueMix = (value: number) => {
      const mixVolume = Math.sqrt((value + 50) / 100);
      const cueVolume = Math.sqrt(1 - (value + 50) / 100);
      this.cueVolume.gain.cancelScheduledValues(0);
      this.cueMixVolume.gain.cancelScheduledValues(0);
      if (isFireFox) {
        this.cueVolume.gain.linearRampToValueAtTime(
          cueVolume < ZERO ? ZERO : cueVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.cueMixVolume.gain.linearRampToValueAtTime(
          mixVolume < ZERO ? ZERO : mixVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      } else {
        this.cueVolume.gain.exponentialRampToValueAtTime(
          cueVolume < ZERO ? ZERO : cueVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.cueMixVolume.gain.exponentialRampToValueAtTime(
          mixVolume < ZERO ? ZERO : mixVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      }
    };
    this.audioMerger = CONTEXT.createChannelMerger(
      CONTEXT.destination.maxChannelCount
    );
    CONTEXT.destination.channelInterpretation = "discrete";
    this.audioMerger.connect(CONTEXT.destination);
    this.mainSplitter = CONTEXT.createChannelSplitter(2);
    this.cueSplitter = CONTEXT.createChannelSplitter(2);
    this.headphonesVolume = CONTEXT.createGain();
    this.cueVolume.connect(this.headphonesVolume);
    this.cueMixVolume.connect(this.headphonesVolume);
    this.headphonesVolume.connect(this.cueSplitter);
    this.headphonesVolume.gain.value = 0.5;
    this.mainInput.connect(this.mainSplitter);
    this.mainSplitter.connect(this.audioMerger, 0, 0);
    this.mainSplitter.connect(this.audioMerger, 1, 1);
    this.updateCueChannel = (nextLeft: number, nextRight: number) => {
      if (
        nextLeft <= CONTEXT.destination.channelCount &&
        nextRight <= CONTEXT.destination.channelCount
      ) {
        this.cueSplitter.disconnect();
        this.cueSplitter.connect(this.audioMerger, 0, nextLeft);
        this.cueSplitter.connect(this.audioMerger, 1, nextRight);
      }
    };
    this.updateMainChannel = (nextLeft: number, nextRight: number) => {
      if (
        nextLeft <= CONTEXT.destination.channelCount &&
        nextRight <= CONTEXT.destination.channelCount
      ) {
        this.mainSplitter.disconnect();
        this.mainSplitter.connect(this.audioMerger, 0, nextLeft);
        this.mainSplitter.connect(this.audioMerger, 1, nextRight);
      }
    };
    this.audioMerger.connect(CONTEXT.destination);
    this.changeHeadphonesVolume = (value: number) => {
      const nextValue = (value + 50) / 100;
      this.headphonesVolume.gain.value = nextValue;
    };
  }
}

export const audioRouter = new AudioRouter();
MAIN_COMPRESSOR.connect(audioRouter.mainInput);
