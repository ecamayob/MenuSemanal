import { Component, computed, inject, input, signal } from '@angular/core';
import { DesplegableComponent } from '../../../components/desplegable/desplegable.component';
import { Plato } from '../../../interfaces/Plato.interface';
import { MenusService } from '../../../services/menus.service';
import { Semana } from '../../../interfaces/semana.interface';

@Component({
  selector: 'menu-dia',
  imports: [DesplegableComponent],
  templateUrl: './menu-dia.html',
})
export class MenuDia {
  public menuservice = inject(MenusService);

  mostrarBuscador = signal<boolean>(false);
  categoriaSeleccionada = signal<number | null>(null);
  platoSeleccionado = signal<Map<number, Plato>>(new Map());

  diaSemana = input<Semana>();

  entradaSeleccionada = computed(
    () => {
      return this.menuservice.menuGrid().find((m) => m.dia.id == this.diaSemana()?.id)?.entrada ?? null;
    }

  );

  fondoSeleccionado = computed(
    () =>
      //this.platoSeleccionado()?.get(2) ?? null
      this.menuservice.menuGrid().find((m) => m.dia.id == this.diaSemana()?.id)?.fondo ?? null,
  );

  toggleBuscador(categoria: number): void {
    if (this.categoriaSeleccionada() == categoria && this.mostrarBuscador()) {
      this.mostrarBuscador.set(false);
    } else {
      this.mostrarBuscador.set(true);
      this.categoriaSeleccionada.set(categoria);
    }
  }

  seleccionarPlato(plato: Plato): void {
    if (plato.usado) return;

    const diaActual = this.diaSemana();
    if (!diaActual) return;

    this.menuservice.asignarPlatoADia(plato, diaActual);

    this.mostrarBuscador.set(false);
  }

  quitarPlato(idcategoria: number): void {
    const diaActual = this.diaSemana();
    if (!diaActual) return;

    this.menuservice.quitarPlatoDelDia(idcategoria, diaActual.id);
  }


  quitarPlato22(idcategoria: number): void {
    const diaActual = this.diaSemana();
    if (!diaActual) return;



    this.menuservice.menuGrid.update((menu) => {
      return menu.map(m => {
        if (m.dia.id == diaActual.id) {
          const idplato = idcategoria == 1 ? m.entrada?.id : m.fondo?.id;
          if (idplato) {
            this.menuservice.liberarPlato(idplato);
          }

          return {
            dia: m.dia,
            entrada: idcategoria == 1 ? undefined : m.entrada,
            fondo: idcategoria == 2 ? undefined : m.fondo,
          };
        }
        return m;
      });
    });
  }


}
