import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MenusService } from '../../../services/menus.service';
import { DialogService } from '../../../services/DialogService.service';
import { NgClass } from '../../../../../../node_modules/@angular/common/types/_common_module-chunk';

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
    //this.limpiarForm();
  }
  seleccionarCategoria(idcategoria: number) {
    this.idcategoria.set(idcategoria);
  }

  async guardarPlato(): Promise<void> {

    const nombre = this.nombreplato();
    const idcategoria = this.idcategoria();

    if (!nombre) {
      await this.dialogService.open({
        title: 'Alerta!!',
        message: 'Debe ingresar el nombre del plato',
        type: 'warning',
        showCancel: false
      });
      return;
    }

    this.menuservice.platos.update((platos) => {
      // Generar un ID seguro basado en el valor máximo actual
      const maxId = platos.reduce((max, p) => (p.id > max ? p.id : max), 0);
      const platoEdit = this.menuservice.platoEnEdicion();
      if (platoEdit) {
        return platos.map(p => p.id == platoEdit.id ? { ...p, nombre, categoria: idcategoria } : p)
      }
      else {
        return [
          ...platos,
          {
            id: maxId + 1,
            nombre,
            categoria: idcategoria,
            usado: false,
          },
        ];
      }
    });


    this.limpiarForm();
    this.cerrarFormulario(false);
    await this.dialogService.open({
      title: 'Éxito',
      message: 'El plato se guardó con éxito.',
      type: 'success',
      showCancel: false // En éxito no suele hacer falta el botón Cancelar
    });

  }

  limpiarForm() {
    this.nombreplato.set('');
    this.idcategoria.set(1);
    console.log("limpiarForm");
  }



}
