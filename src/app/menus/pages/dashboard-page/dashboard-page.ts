import { Component, inject, signal } from '@angular/core';
import { Semana } from '../../interfaces/semana.interface';
import MenuPage from '../menu-page/menu-page';
import { NavBar } from '../../components/navBar/navBar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenusService } from '../../services/menus.service';
import { PopUp } from '../../components/PopUp/PopUp';

@Component({
  selector: 'dashboard-page',
  imports: [NavBar, RouterOutlet, PopUp],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage {
  menuservice = inject(MenusService);


}
