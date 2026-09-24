import { Component, signal } from '@angular/core';
import { Semana } from '../../interfaces/semana.interface';
import MenuPage from '../menu-page/menu-page';

@Component({
  selector: 'dashboard-page',
  imports: [MenuPage],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage {

semana = signal<Semana[]>([
  {id:1, nombre:"Lunes"},
  {id:2, nombre:"Martes"},
  {id:3, nombre:"Miercoles"},
  {id:4, nombre:"Jueves"},
  {id:5, nombre:"Viernes"},
  {id:6, nombre:"Sabado"},
  {id:7, nombre:"Domingo"},
]);




}
