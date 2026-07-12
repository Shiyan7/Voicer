import { createSignal } from 'solid-js';

export enum MODALS {
  AUTH = 'AUTH',
  ROLL_DICE = 'ROLL_DICE',
  STREET_INFO = 'STREET_INFO',
  BUY_STREET = 'BUY_STREET',
  PLAYERS = 'PLAYERS',
  GIVE_UP = 'GIVE_UP',
  CREDIT = 'CREDIT',
  DELETE_MEETING = 'DELETE_MEETING',
}

export const [activeModals, setActiveModals] = createSignal<MODALS[]>([]);

export const showModal = (id: MODALS) =>
  setActiveModals((prev) => [...prev, id]);

export const closeModal = (id: MODALS) =>
  setActiveModals((prev) => prev.filter((modalId) => modalId !== id));
