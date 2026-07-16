import { createSignal } from 'solid-js';

import { useSingletonContext } from '@/shared/singleton';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type Toast = { id: number; type: ToastType; title?: string };

const TOAST_DELETE_DELAY = 4_000;

export const createToasts = () => {
  const [items, setItems] = createSignal<Toast[]>([]);

  const remove = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const show = (type: ToastType, title?: string) => {
    const id = Date.now() + Math.random();

    setItems((current) => [...current, { id, type, title }]);

    setTimeout(() => remove(id), TOAST_DELETE_DELAY);
  };

  return { items, show, remove };
};

export const useToasts = () => useSingletonContext().toasts;
