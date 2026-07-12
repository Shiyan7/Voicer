import { createContext } from 'solid-js';
import { container, DependencyContainer } from '@/shared/di';

export const DIContext = createContext<DependencyContainer>(container);
