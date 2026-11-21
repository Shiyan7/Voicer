import { createSignal } from 'solid-js';

export enum MODALS {
  AUTH = 'AUTH',
  DELETE_CHAT_THREAD = 'DELETE_CHAT_THREAD',
  DELETE_INTERVIEW = 'DELETE_INTERVIEW',
  DELETE_MEETING = 'DELETE_MEETING',
  DELETE_RESUME = 'DELETE_RESUME',
  RENAME_CHAT_THREAD = 'RENAME_CHAT_THREAD',
  REVOKE_API_TOKEN = 'REVOKE_API_TOKEN',
  SEARCH = 'SEARCH',
}

const [activeModals, setActiveModals] = createSignal<MODALS[]>([]);

export { activeModals };

export const showModal = (id: MODALS) =>
  setActiveModals((prev) => [...prev, id]);

export const closeModal = (id: MODALS) =>
  setActiveModals((prev) => prev.filter((modalId) => modalId !== id));
