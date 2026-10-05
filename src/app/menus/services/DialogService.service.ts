// dialog.service.ts
import { Injectable, signal } from '@angular/core';

export type ModalType = 'success' | 'warning' | 'error' | 'info';
export interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  showCancel?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DialogService {// Signal para controlar si el modal se muestra o no y con qué datos
  modalState = signal<ModalOptions & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    showCancel: false
  });

  private resolvePromise?: (value: boolean) => void;

  // Método que abre el modal y retorna una promesa
  open(options: ModalOptions): Promise<boolean> {
    this.modalState.set({
      isOpen: true,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      showCancel: options.showCancel ?? false
    });

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  confirm() {
    this.close(true);
  }

  cancel() {
    this.close(false);
  }

  private close(result: boolean) {
    this.modalState.update(state => ({ ...state, isOpen: false }));
    if (this.resolvePromise) {
      this.resolvePromise(result);
    }
  }
}
