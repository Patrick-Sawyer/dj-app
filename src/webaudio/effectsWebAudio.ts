import { CONTEXT, FADE_IN_OUT_TIME, ZERO } from "./webAudio";

const addReverb = async (convolver: ConvolverNode) => {
  const response = await fetch("/audio/hall.wav");
  const arraybuffer = await response.arrayBuffer();
  const buffer = await CONTEXT.decodeAudioData(arraybuffer);
  convolver.buffer = buffer;
};

class DelayUnit {
  input: GainNode;
  delay: DelayNode;
  output: GainNode;

  constructor(initValue: number) {
    this.input = CONTEXT.createGain();
    this.input.gain.value = initValue;
    this.delay = CONTEXT.createDelay();
    this.delay.delayTime.value = 0.5;
    this.output = CONTEXT.createGain();
    this.output.gain.value = initValue;
    this.input.connect(this.delay);
    this.delay.connect(this.output);
  }
}

class Delay {
  input: GainNode;
  delayOne: DelayUnit;
  // delayTwo: DelayUnit;
  handleChange: (value: number) => void;
  feedback: GainNode;
  output: GainNode;
  // currentLiveUnit: 1 | 2;
  currentDelayTime: number;
  handle2X: () => void;
  lastTap: number;
  tapDelay: () => void;

  constructor() {
    this.input = CONTEXT.createGain();
    this.input.gain.value = 1;
    this.feedback = CONTEXT.createGain();
    this.feedback.gain.value = ZERO;
    this.output = CONTEXT.createGain();
    this.output.gain.value = 1;
    this.delayOne = new DelayUnit(1);
    // this.delayTwo = new DelayUnit(ZERO);
    this.input.connect(this.feedback);
    this.feedback.connect(this.delayOne.input);
    // this.feedback.connect(this.delayTwo.input);
    this.delayOne.output.connect(this.feedback);
    this.delayOne.output.connect(this.output);
    // this.delayTwo.output.connect(this.feedback);
    // this.delayTwo.output.connect(this.output);
    // this.currentLiveUnit = 1;
    this.currentDelayTime = 0.5;

    this.handleChange = (value: number) => {
      this.delayOne.delay.delayTime.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE_IN_OUT_TIME
      );
      this.currentDelayTime = value;

      // const delayOneIsLiveNext = this.currentLiveUnit == 1;

      // if (delayOneIsLiveNext) {
      //   this.delayOne.delay.delayTime.value = value;
      // } else {
      //   this.delayTwo.delay.delayTime.value = value;
      // }

      // setTimeout(() => {
      //   this.delayOne.input.gain.cancelAndHoldAtTime(CONTEXT.currentTime);
      //   this.delayOne.output.gain.cancelAndHoldAtTime(CONTEXT.currentTime);
      //   this.delayTwo.input.gain.cancelAndHoldAtTime(CONTEXT.currentTime);
      //   this.delayTwo.output.gain.cancelAndHoldAtTime(CONTEXT.currentTime);

      //   this.delayOne.input.gain.linearRampToValueAtTime(
      //     delayOneIsLiveNext ? 1 : ZERO,
      //     CONTEXT.currentTime + FADE_IN_OUT_TIME
      //   );

      //   this.delayOne.output.gain.linearRampToValueAtTime(
      //     delayOneIsLiveNext ? 1 : ZERO,
      //     CONTEXT.currentTime + FADE_IN_OUT_TIME
      //   );

      //   this.delayTwo.input.gain.linearRampToValueAtTime(
      //     delayOneIsLiveNext ? ZERO : 1,
      //     CONTEXT.currentTime + FADE_IN_OUT_TIME
      //   );

      //   this.delayTwo.output.gain.linearRampToValueAtTime(
      //     delayOneIsLiveNext ? ZERO : 1,
      //     CONTEXT.currentTime + FADE_IN_OUT_TIME
      //   );

      //   this.currentLiveUnit = delayOneIsLiveNext ? 1 : 2;
      //   this.currentDelayTime = value;
      // }, 5);
    };

    this.handle2X = () => {
      this.handleChange(this.currentDelayTime / 2);
    };

    this.lastTap = 0;
    this.tapDelay = () => {
      const now = Date.now();
      const timeSinceLastTap = (now - this.lastTap) / 1000;
      this.lastTap = now;

      if (timeSinceLastTap < 5) {
        this.handleChange(timeSinceLastTap);
      }
    };
  }
}

export class Effects {
  input: GainNode;
  delay: Delay;
  reverb: ConvolverNode;
  reverbLevel: GainNode;
  output: GainNode;

  constructor() {
    // IN / OUT
    this.input = CONTEXT.createGain();
    this.input.gain.value = 1;
    this.output = CONTEXT.createGain();
    this.output.gain.value = 0.6;

    // DELAY
    this.delay = new Delay();
    this.input.connect(this.delay.input);
    this.delay.output.connect(this.output);

    // REVERB
    this.reverbLevel = CONTEXT.createGain();
    this.reverbLevel.gain.value = ZERO;
    this.reverb = CONTEXT.createConvolver();
    addReverb(this.reverb);
    this.input.connect(this.reverbLevel);
    this.reverbLevel.connect(this.reverb);
    this.reverb.connect(this.output);
  }
}
