import { singleton } from '@/shared/di';
import { SingletonViewModel } from '@/shared/view-model';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

type Toast = { id: number; type: ToastType; title?: string };

const TOAST_DELETE_DELAY = 4_000;

@singleton()
export class ToastsViewModel extends SingletonViewModel {
  items: Toast[] = [];

  show = (type: ToastType, title?: string) => {
    const id = Date.now() + Math.random();

    const newToast = { id, type, title };

    this.items.push(newToast);

    setTimeout(() => this.remove(id), TOAST_DELETE_DELAY);
  };

  remove = (id: number) => {
    this.items = this.items.filter((item) => item.id !== id);
  };
}
