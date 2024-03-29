import { DECKS } from "./deckWebAudio";

export const CONTEXT = new AudioContext();

export const isFireFox =
  window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);

export const MAIN_OUTPUT = CONTEXT.createGain();
const MAIN_COMPRESSOR = CONTEXT.createDynamicsCompressor();
MAIN_OUTPUT.connect(MAIN_COMPRESSOR);
const MASTER_VOLUME = CONTEXT.createGain();
MASTER_VOLUME.gain.value = isFireFox ? 1 : 1.3;
MAIN_COMPRESSOR.connect(MASTER_VOLUME);
export const MAIN_VOLUME = CONTEXT.createGain();
MAIN_VOLUME.gain.value = 0.5;
MASTER_VOLUME.connect(MAIN_VOLUME);


export const ZERO = 0.0001;
export const FADE_IN_OUT_TIME = isFireFox ? 0.1 : 0.05;

export const changeMasterVolume = (nextValue: number) => {
  MAIN_VOLUME.gain.cancelScheduledValues(0);
  const value = (nextValue + 50) / 100;
  const realValue = value < ZERO ? ZERO : value;
  MAIN_VOLUME.gain.linearRampToValueAtTime(realValue, CONTEXT.currentTime + FADE_IN_OUT_TIME);
};

class AudioRouter {
  mainInput: GainNode;
  setCueMix: (value: number) => void;
  audioMerger: ChannelMergerNode;
  mainSplitter: ChannelSplitterNode;
  cueSplitter: ChannelSplitterNode;
  updateCueChannel: (nextLeft: number, nextRight: number) => void;
  updateMainChannel: (nextLeft: number, nextRight: number) => void;
  deckA: GainNode;
  deckB: GainNode;
  headphonesInput: GainNode;
  changeHeadphonesVolume: (value: number) => void;
  handleHeadphoneVolumes: () => void;
  headphonesCueMixAmount: number;

  constructor() {
    this.deckA = CONTEXT.createGain();
    this.deckA.gain.value = 0.49;
    this.deckB = CONTEXT.createGain();
    this.deckB.gain.value = 0.49;
    this.mainInput = CONTEXT.createGain();
    this.mainInput.gain.value = 1;
    this.headphonesCueMixAmount = 0;

    this.handleHeadphoneVolumes = () => {
      // MIX
      const mixVolume = Math.sqrt((this.headphonesCueMixAmount + 50) / 100);
      const deckARealVolume = DECKS.deckA.currentVolume;
      const deckBRealVolume = DECKS.deckB.currentVolume;
      const deckAMixVolume = mixVolume * deckARealVolume;
      const deckBMixVolume = mixVolume * deckBRealVolume;

      // CUE
      const deckACued = DECKS.deckA.isCued;
      const deckBCued = DECKS.deckB.isCued;
      const cueVolume = Math.sqrt(1 - (this.headphonesCueMixAmount + 50) / 100);
      const cueVolumeDeckA = deckACued ? 1 : 0;
      const cueVolumeDeckB = deckBCued ? 1 : 0;
      const deckACueVolume = cueVolume * cueVolumeDeckA;
      const deckBCueVolume = cueVolume * cueVolumeDeckB;

      // COMBINED
      const deckACalculatedVolume = Math.pow(deckACueVolume, 2) +  Math.pow(deckAMixVolume, 2);
      const deckBCalculatedVolume = Math.pow(deckBCueVolume, 2) +  Math.pow(deckBMixVolume, 2);
      this.deckA.gain.cancelScheduledValues(0);
      this.deckB.gain.cancelScheduledValues(0);

      // SET VALUES
      if (isFireFox) {
        this.deckA.gain.linearRampToValueAtTime(
          deckACalculatedVolume < ZERO ? ZERO : deckACalculatedVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.deckB.gain.linearRampToValueAtTime(
          deckBCalculatedVolume < ZERO ? ZERO : deckBCalculatedVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      } else {
        this.deckA.gain.exponentialRampToValueAtTime(
          deckACalculatedVolume < ZERO ? ZERO : deckACalculatedVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.deckB.gain.exponentialRampToValueAtTime(
          deckBCalculatedVolume < ZERO ? ZERO : deckBCalculatedVolume,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      }
    }

    this.setCueMix = (value: number) => {
      this.headphonesCueMixAmount = value;
      this.handleHeadphoneVolumes();
    };
    this.audioMerger = CONTEXT.createChannelMerger(
      CONTEXT.destination.maxChannelCount
    );
    CONTEXT.destination.channelInterpretation = "discrete";
    this.audioMerger.connect(CONTEXT.destination);
    this.mainSplitter = CONTEXT.createChannelSplitter(2);
    this.cueSplitter = CONTEXT.createChannelSplitter(2);
    this.headphonesInput = CONTEXT.createGain();
    this.headphonesInput.connect(this.cueSplitter);
    this.headphonesInput.gain.value = 0.5;
    this.mainInput.connect(this.mainSplitter);
    this.mainSplitter.connect(this.audioMerger, 0, 0);
    this.mainSplitter.connect(this.audioMerger, 1, 1);
    this.deckA.gain.value = 0.7 * 0.7;
    this.deckB.gain.value = 0.7 * 0.7;
    this.deckA.connect(this.headphonesInput);
    this.deckB.connect(this.headphonesInput);

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
      this.headphonesInput.gain.cancelScheduledValues(0);
      const nextValue = (value + 50) / 100;
      this.headphonesInput.gain.linearRampToValueAtTime(nextValue, CONTEXT.currentTime + FADE_IN_OUT_TIME);
    };

  }
}

export const audioRouter = new AudioRouter();
setTimeout(() => {
  audioRouter.handleHeadphoneVolumes();
}, 1000)
MAIN_VOLUME.connect(audioRouter.mainInput);
