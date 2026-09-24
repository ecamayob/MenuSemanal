import { Component, inject, signal } from '@angular/core';
import { Plato } from '../../interfaces/Plato.interface';
import { MenusService } from '../../services/menus.service';
import { DesplegableBotonesComponent } from '../../components/desplegable-botones/desplegable-botones.component';
import { PlatoRow } from './plato-row/plato-row';
import { PlatoAdd } from './plato-add/plato-add';

@Component({
  selector: 'plato-page',
  imports: [PlatoRow, PlatoAdd],
  templateUrl: './plato-page.html',
})
export default class PlatoPage {

  menuservice=inject(MenusService);


}
