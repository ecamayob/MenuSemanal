import { Component, inject } from '@angular/core';
import { MenusService } from '../../services/menus.service';
import { DialogService } from '../../services/DialogService.service';

@Component({
  selector: 'tool-bar',
  imports: [],
  templateUrl: './toolBar.html',
})
export class ToolBar {
menuservice= inject(MenusService);
private dialogService = inject(DialogService);


  async limpiar(): Promise<void> {
    const confirmado = await this.dialogService.confirm({
      title: '¿Estás seguro?',
      message: 'Esta acción reiniciará el menú semanal y los platos.',
      confirmText: 'Sí, limpiar',
      cancelText: 'Cancelar'
    });

    if (confirmado) {
      this.menuservice.menuGrid.set([]);
      this.menuservice.platos.update(platos =>
        platos.map(p => ({ ...p, usado: false }))
      );
    }
  }

}
