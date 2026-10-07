import { Component, computed, ElementRef, inject, input, output, signal, HostListener } from '@angular/core';
import { Plato } from '../../../interfaces/Plato.interface';
import { DesplegableBotonesComponent } from '../../../components/desplegable-botones/desplegable-botones.component';

@Component({
  selector: 'plato-row',
  imports: [DesplegableBotonesComponent],
  templateUrl: './plato-row.html',
})
export class PlatoRow {
  private el = inject(ElementRef);

  plato = input.required<Plato>();
  mostrarBotones = signal<boolean>(false);
  edit= output<void>();


  toggleBotones() {
    this.mostrarBotones.update(val => !val);
  }

  onEditar(){
    this.edit.emit();
    this.toggleBotones();
  }

// Clic en cualquier parte del documento
  @HostListener('document:click', ['$event'])
  clicFuera(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.mostrarBotones.set(false);
    }
  }
}
