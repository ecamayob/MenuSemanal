import { Component, inject } from '@angular/core';
import { MenusService } from '../../services/menus.service';
import { DialogService } from '../../services/DialogService.service';

@Component({
  selector: 'tool-bar',
  imports: [],
  templateUrl: './toolBar.html',
})
export class ToolBar {
  menuservice = inject(MenusService);
  private dialogService = inject(DialogService);

  async GuardarMenu(): Promise<void> {
    if (this.menuservice.menuGrid().length == 0) {
      await this.dialogService.open({
        title: 'Info',
        message: 'Debe seleccionar un menu.',
        type: 'warning',
        showCancel: false
      });
      return;
    }

    this.menuservice.guardarMenusemanal();

    await this.dialogService.open({
        title: 'Exito',
        message: 'Se guardo el menu con exito.',
        type: 'success',
        showCancel: false
      });
  }

  async limpiar(): Promise<void> {

    const confirmado = await this.dialogService.open({
      title: '¿Esta seguro de limpiar?',
      message: 'Esta acción reiniciará el menú semanal y los platos.',
      type: 'info',
      showCancel: true
    });

    if (confirmado) {
      this.menuservice.menuGrid.set([]);
      this.menuservice.platos.update((platos) => platos.map((p) => ({ ...p, usado: false })));
    }
  }
}
