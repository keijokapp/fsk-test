import { windowSize } from './input';

// https://en.wikipedia.org/wiki/Talk%3ABaudot_code#Baudot_keyboard/keyset?
const baudot = {
  a: 11000,
  b: 10011,
  c:  1110,
  d: 10010,
  e: 10000,
  f: 10110,
  g:  1011,
  h:   101,
  i:  1100,
  j: 11010,
  k: 11110,
  l:  1001,
  m:   111,
  n:   110,
  o:    11,
  p:  1101,
  q: 11101,
  r:  1010,
  s: 10100,
  t:     1,
  u: 11100,
  v:  1111,
  w: 11001,
  x: 10111,
  y: 10101,
  z: 10001
};

const baudRate = 45.45;

const audioSampleRate = 48000;
const audioMarkFrequency = 1955; // waves in second
const audioMarkWaveLength = 48000 / audioMarkFrequency; // in samples
const audioSpaceFrequency = 2125; // waves in second
const audioSpaceWaveLength = 48000 / audioSpaceFrequency; // in samples
const audioSamplesPerByte = audioSampleRate * 60 / 45.45;
const audioSamplesPerBit = audioSamplesPerByte / 8;

const samplesPerByte = windowSize;
const samplesPerBit = samplesPerByte / 8;
const downSampleFactor = samplesPerByte / audioSamplesPerByte;
const markWaveLength = audioMarkWaveLength * downSampleFactor;
const spaceWaveLength = audioSpaceWaveLength * downSampleFactor;

console.log("Samples per byte: %f\nSamples per bit: %f\nDown sample factor: %f", audioSamplesPerByte, samplesPerBit, downSampleFactor);
console.log("Mark wave length: %f\nSpace wave length: %f", audioMarkWaveLength, audioSpaceWaveLength);
