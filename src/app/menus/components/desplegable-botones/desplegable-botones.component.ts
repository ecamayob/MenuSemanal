import { Component, inject, input, output, signal } from '@angular/core';
import { MenusService } from '../../services/menus.service';
import { Plato } from '../../interfaces/Plato.interface';
import { DialogService } from '../../services/DialogService.service';

@Component({
  selector: 'desplegable-botones',
  imports: [],
  templateUrl: './desplegable-botones.component.html',
})
export class DesplegableBotonesComponent {
  menuservice = inject(MenusService);
  dialogService = inject(DialogService);

  iplato = input.required<Plato>();
  edit = output<void>();

  editarPlato() {
    this.menuservice.platoEnEdicion.set(this.iplato());
    this.edit.emit();
  }

  async eliminarPlato() {

    if (this.iplato().usado) {
      await this.dialogService.open({
        title: 'No se puede Eliminar!!',
        message: 'El plato esta seleccionado en el Menu Semanal.',
        type: 'info',
        showCancel: false
      });
      return;
    }

    const confirmado = await this.dialogService.open({
      title: '¿Esta seguro de eliminar?',
      message: 'Esta acción eliminara el plato.',
      type: 'warning',
      showCancel: true
    });

    if (confirmado) {
      this.menuservice.platos.update(plato =>
        plato.filter(p => p.id != this.iplato().id)
      );
    }

  }



}
