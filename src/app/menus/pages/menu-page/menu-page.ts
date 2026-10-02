import { Component, computed, inject, input, signal } from '@angular/core';
import { Plato } from '../../interfaces/Plato.interface';
import { MenusService } from '../../services/menus.service';
import { MenuDia } from './menu-dia/menu-dia';
import { ToolBar } from '../../components/toolBar/toolBar';




@Component({
  selector: 'menu-page',
  imports: [MenuDia, ToolBar],
  templateUrl: './menu-page.html',
})
export default class MenuPage {
 menuservice = inject(MenusService);

ngOnInit(): void {
    // AQUÍ SE LLAMA: Carga los días, platos y el menú guardado al entrar a la pantalla
    this.menuservice.cargarDatosIniciales();
  }

}
