import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'toolBar-platos',
  imports: [],
  templateUrl: './toolBar-platos.html',
})
export class ToolBarPlatos {
  openForm = output<boolean>();
  oBusqueda = output<string>();

  abrirRegistroPlatos() {
    this.openForm.emit(true);
  }
  actualizarBusqueda(value:string) {
    this.oBusqueda.emit(value);
  }
}
