import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MenusService } from '../../../services/menus.service';
import { DialogService } from '../../../services/DialogService.service';
import { NgClass } from '../../../../../../node_modules/@angular/common/types/_common_module-chunk';
import { Plato } from '../../../interfaces/Plato.interface';

@Component({
  selector: 'plato-add',
  imports: [],
  templateUrl: './plato-add.html',
})
export class PlatoAdd {
  menuservice = inject(MenusService);
  dialogService = inject(DialogService);

  cancel = output<void>();
  idcategoria = signal<number>(1);
  nombreplato = signal<string>('');

  constructor() {
    effect(() => {
      const plato = this.menuservice.platoEnEdicion();
      if (plato) {
        this.nombreplato.set(plato?.nombre ?? '');
        this.idcategoria.set(plato?.categoria ?? 1);
      } else {
        this.limpiarForm();
      }

    })
  }

  cerrarFormulario(value: boolean) {
    this.cancel.emit();
    this.menuservice.platoEnEdicion.set(null);
  }

  seleccionarCategoria(idcategoria: number) {
    this.idcategoria.set(idcategoria);
  }

  async guardarPlato(): Promise<void> {

    if (!this.nombreplato()) {
      await this.dialogService.open({
        title: 'Alerta!!',
        message: 'Debe ingresar el nombre del plato',
        type: 'warning',
        showCancel: false
      });
      return;
    }

    const nuevoplato: Plato = {
      id: 0,
      nombre: this.nombreplato(),
      categoria: this.idcategoria(),
      usado: false
    };

    const platoEdit = this.menuservice.platoEnEdicion();
    if (platoEdit) {
      this.menuservice.editarPlatoBD({...nuevoplato,id:platoEdit.id});
    }
    else {
      this.menuservice.guardarPlatoBD(nuevoplato);

    }
    await this.dialogService.open({
      title: 'Éxito',
      message: 'El plato se guardó con éxito.',
      type: 'success',
      showCancel: false // En éxito no suele hacer falta el botón Cancelar
    });
    this.limpiarForm();
    this.cerrarFormulario(false);
  }

  limpiarForm() {
    this.nombreplato.set('');
    this.idcategoria.set(1);
    console.log("limpiarForm");
  }



}
