import { SpringKick } from '../types/SpringKick';

export const createSpring = (stiffness: number, damping: number) => {
  let value = 0;
  let velocity = 0;
  let kicks: SpringKick[] = [];

  const kick = (at: number, strength: number) => {
    kicks.push({ at, strength });
  };

  const step = (dt: number, time: number, target: number) => {
    kicks = kicks.filter((pending) => {
      if (pending.at > time) return true;
      velocity += pending.strength;
      return false;
    });
    velocity += (stiffness * (target - value) - damping * velocity) * dt;
    value += velocity * dt;
    return value;
  };

  const settle = (target: number) => {
    value = target;
    velocity = 0;
    kicks = [];
  };

  return {
    kick,
    step,
    settle,
    value: () => value,
  };
};
