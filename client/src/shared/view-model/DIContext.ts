import { createContext } from 'solid-js';
import { container, DependencyContainer } from 'tsyringe';

export const DIContext = createContext<DependencyContainer>(container);
