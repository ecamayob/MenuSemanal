import { Component, inject, signal } from '@angular/core';
import { Plato } from '../../interfaces/Plato.interface';
import { MenusService } from '../../services/menus.service';

@Component({
  selector: 'plato-page',
  imports: [],
  templateUrl: './plato-page.html',
})
export default class PlatoPage {

 menuservice=inject(MenusService);

mostrarBotones = signal<boolean>(false);

}
