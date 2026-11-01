import { DeepgramClient } from '@deepgram/sdk';

type ListenConnectArgs = Parameters<
  DeepgramClient['listen']['v1']['connect']
>[0];

export const LIVE_AUDIO_PATH = '/live-audio';

export const KEEP_ALIVE_INTERVAL_MS = 5000;

export const DEEPGRAM_LIVE_OPTIONS: ListenConnectArgs = {
  model: 'nova-3',
  encoding: 'linear16',
  sample_rate: 16000,
  channels: 1,
  interim_results: 'true',
  smart_format: 'true',
  punctuate: 'true',
  endpointing: 300,
  utterance_end_ms: 1000,
  vad_events: 'true',
};
