import { Component, input, signal } from '@angular/core';
import { Plato } from '../../../interfaces/Plato.interface';
import { DesplegableBotonesComponent } from '../../../components/desplegable-botones/desplegable-botones.component';

@Component({
  selector: 'plato-row',
  imports: [DesplegableBotonesComponent],
  templateUrl: './plato-row.html',
})
export class PlatoRow {

  plato = input<Plato | null>(null);
  mostrarBotones = signal<boolean>(false);



  toggleBotones() {
    this.mostrarBotones.update(val => !val);
  }

}
