import { Component, signal } from '@angular/core';
import { Semana } from '../../interfaces/semana.interface';
import MenuPage from '../menu-page/menu-page';
import { NavBar } from '../../components/navBar/navBar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'dashboard-page',
  imports: [NavBar, RouterOutlet],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage {






}
