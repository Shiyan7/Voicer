import { Accessor, createSignal } from 'solid-js';

export interface Toggler {
  isOpen: Accessor<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function createToggler(initialState = false): Toggler {
  const [isOpen, setIsOpen] = createSignal(initialState);

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  const open = () => {
    setIsOpen(true);
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
