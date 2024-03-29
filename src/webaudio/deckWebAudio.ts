import { TuneMetaData } from "../App";
import { Effects } from "./effectsWebAudio";
import {
  audioRouter,
  CONTEXT,
  FADE_IN_OUT_TIME,
  isFireFox,
  MAIN_OUTPUT,
  ZERO,
} from "./webAudio";

const workerPath = "worklet/audioWorklet.js";
CONTEXT.audioWorklet.addModule(workerPath);

export enum PlaybackStates {
  EMPTY = "empty",
  PLAYING = "playing",
  PAUSED = "paused",
  LOADING = "loading",
}

const createPositionTracker = (buffer: AudioBuffer): AudioBufferSourceNode => {
  const counterBuffer = CONTEXT.createBuffer(
    1,
    buffer.length,
    CONTEXT.sampleRate
  );
  const counterSource = CONTEXT.createBufferSource();

  const length = counterBuffer.length;

  for (let i = 0; i < length; ++i) {
    counterBuffer.getChannelData(0)[i] = i / length;
  }
  counterSource.buffer = counterBuffer;
  return counterSource;
};

const debouncedPositionScroller = (
  callback: (buffer: AudioBuffer, speed: number, position: number) => void
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (buffer: AudioBuffer, speed: number, position: number) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      callback(buffer, speed, position);
    }, 1000);
  };
};

export class Deck {
  output: GainNode;
  computedPlaybackSpeed: number;
  setPlayBackSpeed: (newSpeed: number) => void;
  cuePoint: null | number;
  play: () => void;
  pause: () => void;
  handleCuePoint: () => void;
  rewind: (amount: number) => void;
  currentVolume: number;
  fastForward: (amount: number) => void;
  mainPlaybackSpeed: number;
  handleJogWheel: (nextValue: number, zoom: number) => void;
  jogWheelValue: number;
  metaData: TuneMetaData;
  loadTrack: (nextTrack: any) => void;
  eject: () => void;
  playbackState: PlaybackStates;
  setVolume: (nextVolume: number) => void;
  waveformData: number[] | null;
  audioElement: HTMLMediaElement | null;
  loadedTrack: AudioBufferSourceNode | null;
  handlePlayPause: () => void;
  setPlaybackState: null | ((nextState: PlaybackStates) => void);
  masterGain: GainNode;
  compressor: DynamicsCompressorNode;
  meterCompressor: DynamicsCompressorNode;
  setMasterGain: (nextVolume: number) => void;
  lowPassFilter: BiquadFilterNode;
  setFilter: (nextValue: any) => void;
  highPassFilter: BiquadFilterNode;
  audioAnalyser: AnalyserNode;
  playbackRate: number;
  setWaveform: null | ((data: number[] | undefined) => void);
  onEnded: () => void;
  restart: () => void;
  highEQ: BiquadFilterNode;
  midEQ: BiquadFilterNode;
  lowEQ: BiquadFilterNode;
  changeHigh: (nextValue: number) => void;
  changeMid: (nextValue: number) => void;
  changeLow: (nextValue: number) => void;
  changeEQ: (eq: BiquadFilterNode, value: number) => void;
  positionTracker: null | AudioBufferSourceNode;
  positionReporter: AudioWorkletNode | null;
  updatePosition: null | ((position: number) => void);
  position: number;
  backupBuffer: null | AudioBuffer;
  loadAndPlayTrack: (
    buffer: AudioBuffer,
    speed: number,
    position: number
  ) => void;
  setCuePoint: ((position: number | null) => void) | null;
  handleScroll: (buffer: AudioBuffer, speed: number, position: number) => void;
  effects: Effects;
  outputWithEffects: GainNode;
  wetEffects: GainNode;
  dryValue: GainNode;
  outputWithEffectsAndVolume: GainNode;
  isCued: boolean;
  scrolling: boolean;

  constructor() {
    this.isCued = false;
    this.effects = new Effects();
    this.loadedTrack = null;
    this.position = 0;
    this.masterGain = CONTEXT.createGain();
    this.masterGain.gain.value = 0.6;
    this.lowPassFilter = CONTEXT.createBiquadFilter();
    this.lowPassFilter.type = "lowpass";
    this.lowPassFilter.frequency.value = 25;
    this.lowPassFilter.Q.value = 4;
    this.highPassFilter = CONTEXT.createBiquadFilter();
    this.highPassFilter.type = "highpass";
    this.highPassFilter.frequency.value = 20000;
    this.highPassFilter.Q.value = 6;
    this.highEQ = CONTEXT.createBiquadFilter();
    this.highEQ.type = "highshelf";
    this.highEQ.frequency.value = 2000;
    this.midEQ = CONTEXT.createBiquadFilter();
    this.midEQ.type = "peaking";
    this.midEQ.frequency.value = 900;
    this.midEQ.Q.value = 1;
    this.lowEQ = CONTEXT.createBiquadFilter();
    this.lowEQ.type = "lowshelf";
    this.lowEQ.frequency.value = 100;
    this.compressor = new DynamicsCompressorNode(CONTEXT, {
      threshold: -10,
      ratio: 2,
      knee: 20,
    });
    this.audioAnalyser = CONTEXT.createAnalyser();
    this.currentVolume = 0.7;
    this.output = CONTEXT.createGain();
    this.output.gain.value = ZERO;
    this.output.connect(this.effects.input);
    this.outputWithEffects = CONTEXT.createGain();
    this.outputWithEffects.gain.value = 1;
    this.wetEffects = CONTEXT.createGain();
    this.effects.output.connect(this.wetEffects);
    this.wetEffects.gain.value = ZERO;
    this.wetEffects.connect(this.outputWithEffects);
    this.dryValue = CONTEXT.createGain();
    this.dryValue.gain.value = 1;
    this.output.connect(this.dryValue);
    this.dryValue.connect(this.outputWithEffects);
    this.masterGain.connect(this.lowPassFilter);
    this.lowPassFilter.connect(this.highPassFilter);
    this.outputWithEffectsAndVolume = CONTEXT.createGain();
    this.outputWithEffects.gain.value = 0.7;
    this.outputWithEffects.connect(this.outputWithEffectsAndVolume);
    this.highPassFilter.connect(this.lowEQ);
    this.lowEQ.connect(this.midEQ);
    this.midEQ.connect(this.highEQ);
    this.highEQ.connect(this.compressor);
    this.meterCompressor = CONTEXT.createDynamicsCompressor();
    this.highEQ.connect(this.meterCompressor);
    this.meterCompressor.connect(this.audioAnalyser);
    this.compressor.connect(this.output);
    // this.audioAnalyser.connect(this.output);

    this.audioElement = null;
    this.playbackRate = 1;
    this.positionTracker = null;
    this.updatePosition = null;
    this.positionReporter = null;
    this.backupBuffer = null;
    this.playbackState = PlaybackStates.EMPTY;
    this.loadTrack = async (blob: Blob) => {
      if (CONTEXT.state === "suspended") CONTEXT.resume();
      this.playbackState = PlaybackStates.LOADING;
      this.setPlaybackState && this.setPlaybackState(PlaybackStates.LOADING);
      blob.arrayBuffer().then(async (arrayBuffer) => {
        const audioBuffer = await CONTEXT.decodeAudioData(arrayBuffer);
        this.backupBuffer = audioBuffer;
        this.loadAndPlayTrack(audioBuffer, ZERO, 0);
        const waveformData = calculateWaveformData(
          audioBuffer.getChannelData(0),
          audioBuffer.sampleRate / 120
        );
        this.setWaveform && this.setWaveform(waveformData);
        this.waveformData = waveformData;
      });
    };
    this.loadAndPlayTrack = (
      buffer: AudioBuffer,
      speed: number,
      position: number
    ) => {
      this.playbackState = PlaybackStates.LOADING;
      this.setPlaybackState && this.setPlaybackState(PlaybackStates.LOADING);
      setTimeout(() => {
        this.loadedTrack = CONTEXT.createBufferSource();
        this.loadedTrack.buffer = buffer;
        this.loadedTrack.connect(this.masterGain);
        this.loadedTrack.onended = this.onEnded;
        this.loadedTrack.playbackRate.value = speed;
        this.positionTracker = createPositionTracker(buffer);
        this.positionReporter = new AudioWorkletNode(
          CONTEXT,
          "position-reporting-processor"
        );
        this.positionReporter.port.onmessage = (e) => {
          if (
            this.playbackState === PlaybackStates.PLAYING &&
            this.updatePosition
          ) {
            this.updatePosition(e.data);
            this.position = e.data;
          }
        };
        this.positionTracker.connect(this.positionReporter);
        this.positionReporter.connect(CONTEXT.destination);
        this.positionTracker.playbackRate.value = speed;
        this.positionTracker.start(0, position);
        if (this.backupBuffer) {
          this.position = position / this.backupBuffer.duration;
        }
        this.loadedTrack.start(0, position);
        setTimeout(() => {
          this.playbackState = PlaybackStates.PAUSED;
          this.setPlaybackState && this.setPlaybackState(PlaybackStates.PAUSED);
          this.scrolling = false;
        }, 200);
      }, 100);
    };
    this.eject = () => {
      if (this.playbackState === PlaybackStates.PAUSED) {
        this.cuePoint = null;
        this.setCuePoint && this.setCuePoint(null);
        this.playbackState = PlaybackStates.EMPTY;
        this.setPlaybackState && this.setPlaybackState(PlaybackStates.EMPTY);
        this.metaData = {};
        this.loadedTrack = null;
        this.positionTracker?.disconnect();
        this.positionTracker = null;
        this.waveformData = null;
        this.setWaveform && this.setWaveform(undefined);
        this.positionReporter = null;
        this.updatePosition && this.updatePosition(0);
        this.position = 0;
      }
    };
    this.onEnded = () => {
      this.playbackState = PlaybackStates.PAUSED;
      this.setPlaybackState && this.setPlaybackState(PlaybackStates.PAUSED);
    };
    this.setPlaybackState = null;
    this.handlePlayPause = () => {
      if (this.playbackState === PlaybackStates.PLAYING) {
        this.pause();
        return;
      }

      if (this.playbackState === PlaybackStates.PAUSED) {
        this.play();
      }
    };
    this.play = () => {
      if (this.loadedTrack) {
        this.loadedTrack.playbackRate.value = this.playbackRate;
        if (this.positionTracker)
          this.positionTracker.playbackRate.value = this.playbackRate;
        this.playbackState = PlaybackStates.PLAYING;
        this.setPlaybackState && this.setPlaybackState(PlaybackStates.PLAYING);
        this.output.gain.value = ZERO;
        this.output.gain.exponentialRampToValueAtTime(
          1,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      }
    };
    this.pause = () => {
      if (this.loadedTrack) {
        this.setPlaybackState && this.setPlaybackState(PlaybackStates.PAUSED);
        this.playbackState = PlaybackStates.PAUSED;
        this.output.gain.cancelScheduledValues(0);
        this.output.gain.exponentialRampToValueAtTime(
          ZERO,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        setTimeout(() => {
          if (this.playbackState === PlaybackStates.PAUSED) {
            if (this.loadedTrack)
              this.loadedTrack.playbackRate.value = isFireFox ? ZERO : 0;
            if (this.positionTracker)
              this.positionTracker.playbackRate.value = isFireFox ? ZERO : 0;
          }
        }, FADE_IN_OUT_TIME * 1010);
      }
    };
    this.mainPlaybackSpeed = 1;
    this.computedPlaybackSpeed = 1;
    this.jogWheelValue = 1;

    this.scrolling = false;

    this.handleJogWheel = (nextValue: number, zoom: number) => {
      if (this.loadedTrack && this.playbackState === PlaybackStates.PLAYING) {
        this.jogWheelValue = nextValue;
        this.computedPlaybackSpeed = this.mainPlaybackSpeed * nextValue;
        this.loadedTrack.playbackRate.cancelScheduledValues(
          CONTEXT.currentTime
        );
        if (this.positionTracker)
          this.positionTracker.playbackRate.cancelScheduledValues(
            CONTEXT.currentTime
          );
        this.loadedTrack.playbackRate.linearRampToValueAtTime(
          this.computedPlaybackSpeed,
          CONTEXT.currentTime + 0.1
        );
        if (this.positionTracker)
          this.positionTracker.playbackRate.linearRampToValueAtTime(
            this.computedPlaybackSpeed,
            CONTEXT.currentTime + 0.1
          );
      } else {
        this.computedPlaybackSpeed = this.mainPlaybackSpeed;
        this.jogWheelValue = 1;
        if (
          this.position === null ||
          !this.backupBuffer ||
          (this.playbackState !== PlaybackStates.PAUSED && !this.scrolling) ||
          !this.loadedTrack
        ) {
          return;
        }

        if (!this.scrolling) {
          this.scrolling = true;
          this.loadedTrack?.disconnect();
          this.positionTracker?.disconnect();
          this.playbackState = PlaybackStates.LOADING;
          this.setPlaybackState &&
            this.setPlaybackState(PlaybackStates.LOADING);
        }

        const nextPosition = limit(
          ((nextValue - 1) * zoom) / 100 + this.position
        );
        this.updatePosition && this.updatePosition(nextPosition);
        this.position = nextPosition;

        this.handleScroll(
          this.backupBuffer,
          isFireFox ? ZERO : 0,
          nextPosition * this.backupBuffer.duration
        );
      }
    };
    this.handleScroll = debouncedPositionScroller(this.loadAndPlayTrack);
    this.setPlayBackSpeed = (speed: number) => {
      const newSpeed = isFireFox && speed < ZERO ? ZERO : speed;
      this.mainPlaybackSpeed = newSpeed;
      if (this.loadedTrack) {
        this.playbackRate = newSpeed;
        if (this.playbackState === PlaybackStates.PLAYING) {
          this.loadedTrack.playbackRate.value = newSpeed;
          if (this.positionTracker)
            this.positionTracker.playbackRate.value = newSpeed;
        }
      }
    };
    this.cuePoint = null;
    this.handleCuePoint = () => {
      if (this.playbackState === PlaybackStates.PAUSED) {
        this.cuePoint = this.position;
        this.setCuePoint && this.setCuePoint(this.position);
      } else if (
        this.playbackState === PlaybackStates.PLAYING &&
        this.backupBuffer &&
        this.cuePoint !== null
      ) {
        this.pause();
        setTimeout(() => {
          if (this.cuePoint === null || this.backupBuffer === null) return;
          this.updatePosition && this.updatePosition(this.cuePoint);
          this.loadedTrack?.disconnect();
          this.positionTracker?.disconnect();
          this.loadAndPlayTrack(
            this.backupBuffer,
            isFireFox ? ZERO : 0,
            this.cuePoint * this.backupBuffer.duration
          );
        }, 100);
      }
    };
    this.setCuePoint = null;
    this.rewind = (amount: number) => {};
    this.fastForward = (amount: number) => {};
    this.restart = () => {
      if (!this.backupBuffer) return;
      this.pause();
      setTimeout(() => {
        if (!this.backupBuffer) return;
        this.updatePosition && this.updatePosition(0);
        this.loadedTrack?.disconnect();
        this.positionTracker?.disconnect();
        this.loadAndPlayTrack(
          this.backupBuffer,
          this.playbackState === PlaybackStates.PLAYING
            ? this.playbackRate
            : isFireFox
            ? ZERO
            : 0,
          0
        );
      }, 100);
    };
    this.setFilter = (nextValue: number) => {
      const isLowPass = nextValue <= 0;
      if (isLowPass) {
        this.highPassFilter.frequency.exponentialRampToValueAtTime(
          25,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.highPassFilter.Q.exponentialRampToValueAtTime(
          ZERO,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.lowPassFilter.Q.exponentialRampToValueAtTime(
          4,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        const value = Math.pow((nextValue + 50) / 50, 5) * 19950 + 25;
        this.lowPassFilter.frequency.exponentialRampToValueAtTime(
          value,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      } else {
        this.lowPassFilter.frequency.exponentialRampToValueAtTime(
          20000,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.lowPassFilter.Q.exponentialRampToValueAtTime(
          ZERO,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        this.highPassFilter.Q.exponentialRampToValueAtTime(
          6,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
        const exponential = Math.pow(Math.abs(nextValue / 50), 4);
        const valueToSave = (exponential + (isLowPass ? 50 : 0)) * 15000 + 25;
        this.highPassFilter.frequency.exponentialRampToValueAtTime(
          valueToSave,
          CONTEXT.currentTime + FADE_IN_OUT_TIME
        );
      }
    };
    this.metaData = {};
    this.setVolume = (nextVolume: number) => {
      const value = nextVolume > 1 ? 1 : nextVolume < ZERO ? ZERO : nextVolume;
      this.currentVolume = value;
      this.outputWithEffectsAndVolume.gain.cancelScheduledValues(0);
      this.outputWithEffectsAndVolume.gain.exponentialRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE_IN_OUT_TIME
      );
    };
    this.setMasterGain = (nextVolume: number) => {
      const value = nextVolume > 1 ? 1 : nextVolume < ZERO ? ZERO : nextVolume;
      this.masterGain.gain.cancelScheduledValues(0);
      this.masterGain.gain.exponentialRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE_IN_OUT_TIME
      );
    };
    this.setWaveform = null;
    this.waveformData = null;
    this.changeHigh = (value: number) => {
      this.changeEQ(this.highEQ, value);
    };
    this.changeMid = (value: number) => {
      this.changeEQ(this.midEQ, value);
    };
    this.changeLow = (value: number) => {
      this.changeEQ(this.lowEQ, value);
    };
    this.changeEQ = (eq: BiquadFilterNode, value: number) => {
      const nextValue = value < 0 ? value : value / 5;
      eq.gain.linearRampToValueAtTime(nextValue, CONTEXT.currentTime + FADE_IN_OUT_TIME);
    };
  }
}

export const DECKS = {
  deckA: new Deck(),
  deckB: new Deck(),
};

const calculateWaveformData = (data: Float32Array, numberPerBatch: number) => {
  const dataToReturn = new Array(Math.round(data.length / numberPerBatch));

  for (let i = 0; i < dataToReturn.length; i++) {
    const init = Math.round(i * numberPerBatch);
    const last = init + Math.round(numberPerBatch) - 1;
    const batchToRender = data.slice(init, last);
    const average = calculateAverage(batchToRender);
    dataToReturn[i] = average;
  }

  return dataToReturn;
};

const calculateAverage = (array: Float32Array) => {
  let total = 0;
  array.forEach((value) => {
    total += Math.abs(value);
  });
  return Math.pow(total / array.length, 0.6);
};

const limit = (value: number) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

DECKS.deckA.outputWithEffects.connect(audioRouter.deckA);
DECKS.deckB.outputWithEffects.connect(audioRouter.deckB);
DECKS.deckA.outputWithEffectsAndVolume.connect(MAIN_OUTPUT);
DECKS.deckB.outputWithEffectsAndVolume.connect(MAIN_OUTPUT);
