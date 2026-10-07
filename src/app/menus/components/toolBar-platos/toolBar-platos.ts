import { Component, inject, output, signal } from '@angular/core';
import { MenusService } from '../../services/menus.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'toolBar-platos',
  imports: [NgClass],
  templateUrl: './toolBar-platos.html',
})
export class ToolBarPlatos {
  menuservice = inject(MenusService);
  //showForm=signal<boolean>(false);
  addDish = output<void>();
  oBusqueda = output<string>();
  filtroTipo: any;

  abrirFormularioPlatos() {
    this.addDish.emit();
  }
  actualizarBusqueda(value: string) {
    this.oBusqueda.emit(value);
  }
}
