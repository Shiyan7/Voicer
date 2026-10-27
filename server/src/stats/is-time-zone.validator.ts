import { registerDecorator, ValidationOptions } from 'class-validator';

const isTimeZone = (value: unknown) => {
  if (typeof value !== 'string') return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
};

export const IsTimeZone =
  (options?: ValidationOptions): PropertyDecorator =>
  (target, propertyName) =>
    registerDecorator({
      name: 'isTimeZone',
      target: target.constructor,
      propertyName: propertyName as string,
      options: { message: 'Unknown time zone', ...options },
      validator: { validate: isTimeZone },
    });
