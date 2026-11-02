const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BYTES_PER_SAMPLE = 2;
const HEADER_SIZE = 44;

export function pcmToWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(HEADER_SIZE);
  header.write('RIFF', 0);
  header.writeUInt32LE(HEADER_SIZE - 8 + pcm.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE, 28);
  header.writeUInt16LE(CHANNELS * BYTES_PER_SAMPLE, 32);
  header.writeUInt16LE(BYTES_PER_SAMPLE * 8, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}
