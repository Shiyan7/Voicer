import { spawn } from 'child_process';
import ffmpegPath = require('ffmpeg-static');

export function transcodeToMp3(
  sourcePath: string,
  targetPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error('ffmpeg binary not found'));
      return;
    }

    const ffmpeg = spawn(ffmpegPath, [
      '-y',
      '-i',
      sourcePath,
      '-vn',
      '-acodec',
      'libmp3lame',
      '-q:a',
      '4',
      targetPath,
    ]);

    let stderr = '';
    ffmpeg.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
    });
  });
}
