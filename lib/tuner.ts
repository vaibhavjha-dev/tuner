export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const GUITAR_STRINGS = [
  { note: "E", octave: 2, frequency: 82.41 },
  { note: "A", octave: 2, frequency: 110.00 },
  { note: "D", octave: 3, frequency: 146.83 },
  { note: "G", octave: 3, frequency: 196.00 },
  { note: "B", octave: 3, frequency: 246.94 },
  { note: "E", octave: 4, frequency: 329.63 },
];

export function getNote(frequency: number) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const noteIndex = Math.round(noteNum) + 69;
  
  // Calculate note name and octave
  // MIDI note 69 is A4 (440Hz)
  // MIDI note 0 is C-1
  // C0 is 12
  
  const octave = Math.floor(noteIndex / 12) - 1;
  const noteName = NOTES[noteIndex % 12];
  
  // Calculate cents off
  const perfectFrequency = 440 * Math.pow(2, (Math.round(noteNum)) / 12);
  const cents = Math.floor(1200 * Math.log(frequency / perfectFrequency) / Math.log(2));

  return {
    note: noteName,
    octave,
    cents,
    frequency,
    perfectFrequency
  };
}

export function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let size = buf.length;
  let rms = 0;

  for (let i = 0; i < size; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / size);

  if (rms < 0.01) {
    // Not enough signal
    return -1;
  }

  let r1 = 0, r2 = size - 1, thres = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < thres) {
      r2 = size - i;
      break;
    }
  }

  buf = buf.slice(r1, r2);
  size = buf.length;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}
