import { Component, inject, output, signal } from '@angular/core';
import { MenusService } from '../../../services/menus.service';

@Component({
  selector: 'plato-add',
  imports: [],
  templateUrl: './plato-add.html',
})
export class PlatoAdd {
  menuservice = inject(MenusService);
  openForm = output<boolean>();
  idcategoria = signal<number>(1);
  nombreplato = signal<string>('');

  cerrarFormulario(value: boolean) {
    this.openForm.emit(false);
  }
  seleccionarCategoria(idcategoria: number) {
    this.idcategoria.set(idcategoria);
  }

  guardarPlato() {
    return this.menuservice.platos.update((plato) =>
       [
        ...plato,
        {
          id: plato.length+1,
          nombre: this.nombreplato(),
          categoria: this.idcategoria(),
          usado: false,
        },
      ]);
  }

}
