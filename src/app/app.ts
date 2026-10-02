import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenusService } from './menus/services/menus.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('MenuSemanalApp');
  menuservice = inject(MenusService);
}
