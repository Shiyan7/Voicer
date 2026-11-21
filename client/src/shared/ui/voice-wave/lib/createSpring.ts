export const createSpring = (stiffness: number, damping: number) => {
  let value = 0;
  let velocity = 0;

  const step = (dt: number, target: number) => {
    velocity += (stiffness * (target - value) - damping * velocity) * dt;
    value += velocity * dt;
    return value;
  };

  return { step };
};
