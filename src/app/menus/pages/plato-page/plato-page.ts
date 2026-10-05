import { Component, computed, inject, signal } from '@angular/core';
import { Plato } from '../../interfaces/Plato.interface';
import { MenusService } from '../../services/menus.service';
import { ToolBarPlatos } from '../../components/toolBar-platos/toolBar-platos';
import { PlatoRow } from './plato-row/plato-row';
import { PlatoAdd } from './plato-add/plato-add';

@Component({
  selector: 'plato-page',
  imports: [PlatoRow, PlatoAdd, ToolBarPlatos],
  templateUrl: './plato-page.html',
})
export default class PlatoPage {
  menuservice = inject(MenusService);
  showForm = signal<boolean>(false);
  busqueda = signal<string>('');

  platosfiltrados = computed(() => {
    const busqueda = this.busqueda().toLowerCase();
    return this.menuservice
      .platos()
      .filter((plato) => plato.nombre.toLowerCase().includes(busqueda));
  });

  abrirFormulario(value: boolean) {
    this.showForm.set(value);
  }
}
