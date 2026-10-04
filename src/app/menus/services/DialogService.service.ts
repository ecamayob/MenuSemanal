// dialog.service.ts
import { Injectable, signal } from '@angular/core';

export interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  // Estado interno con Signals
  isOpen = signal<boolean>(false);
  options = signal<DialogOptions>({ title: '', message: '' });

  private resolveRef?: (value: boolean) => void;

  /**
   * Abre el modal y retorna una Promesa que resuelve `true` (aceptar) o `false` (cancelar).
   */
  confirm(options: DialogOptions): Promise<boolean> {
    this.options.set({
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      ...options
    });
    this.isOpen.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolveRef = resolve;
    });
  }

  confirmAction(): void {
    this.close(true);
  }

  cancelAction(): void {
    this.close(false);
  }

  private close(result: boolean): void {
    this.isOpen.set(false);
      console.log(this.resolveRef);
    if (this.resolveRef) {
      this.resolveRef(result);
      this.resolveRef = undefined;
    }
  }
}
