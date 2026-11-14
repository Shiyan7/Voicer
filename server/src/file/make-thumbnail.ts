import { spawn } from 'child_process';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

export function makeThumbnail(
  sourcePath: string,
  targetPath: string,
  width: number,
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
      '-vf',
      `scale=${width}:-2`,
      '-q:v',
      '5',
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
