import { LiveTurn } from '../../../types/LiveTurn';

export const hasTurnImage = (
  turn: LiveTurn,
): turn is LiveTurn & { imageUrl: string } => !!turn.imageUrl;
