import {
  FLOW_SPEED_PX,
  WAVE_COLORS,
  WAVE_LAYERS,
} from '../config/voiceWaveConfig';
import { WaveFrame } from '../types/WaveFrame';
import { WaveLayer } from '../types/WaveLayer';
import { createFlowGradient } from './createFlowGradient';
import { createLineBlob } from './createLineBlob';
import { traceWave } from './traceWave';

const STEP_PX = 4;

export const createWaveScene = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  const shapes = WAVE_LAYERS.map(createLineBlob);
  let width = 0;
  let height = 0;
  let barHeight = 0;
  let depths = new Float32Array(0);
  let flow = 0;

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    barHeight = canvas.parentElement?.clientHeight ?? 0;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    depths = new Float32Array(Math.ceil(width / STEP_PX) + 1);
    shapes.forEach((shape) => shape.resize(width));
  };

  const drawLayer = (layer: WaveLayer, index: number, frame: WaveFrame) => {
    const reach = height - barHeight;
    const amplitude = frame.size * layer.depth * frame.presence * reach;
    for (let i = 0; i < depths.length; i++) {
      const shape = shapes[index].sample(i * STEP_PX);
      depths[i] = barHeight + Math.min(reach, amplitude * shape);
    }
    traceWave(ctx, depths, STEP_PX, barHeight - 1);
    ctx.globalAlpha = layer.alpha;
    ctx.fill();
    ctx.globalAlpha = layer.edgeAlpha * frame.presence;
    ctx.stroke();
  };

  const draw = (frame: WaveFrame) => {
    flow += frame.travel * FLOW_SPEED_PX;
    shapes.forEach((shape) => shape.advance(frame.travel));

    const gradient = createFlowGradient(ctx, WAVE_COLORS, width, flow);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = gradient;
    ctx.strokeStyle = gradient;
    WAVE_LAYERS.forEach((layer, index) => drawLayer(layer, index, frame));
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, width, barHeight);
  };

  resize();

  return { resize, draw };
};
