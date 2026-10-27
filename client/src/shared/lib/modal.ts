import { createSignal } from 'solid-js';

export enum MODALS {
  AUTH = 'AUTH',
  DELETE_MEETING = 'DELETE_MEETING',
  SEARCH = 'SEARCH',
}

const [activeModals, setActiveModals] = createSignal<MODALS[]>([]);

export { activeModals };

export const showModal = (id: MODALS) =>
  setActiveModals((prev) => [...prev, id]);

export const closeModal = (id: MODALS) =>
  setActiveModals((prev) => prev.filter((modalId) => modalId !== id));
