import { createMutable } from 'solid-js/store';

export abstract class SingletonViewModel {
  constructor() {
    return createMutable(this);
  }
}
