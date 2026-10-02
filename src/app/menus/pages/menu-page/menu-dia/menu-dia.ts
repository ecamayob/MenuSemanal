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
    () =>
      // this.platoSeleccionado()?.get(1) ?? null
      this.menuservice.menuGrid().find((m) => m.dia.id == this.diaSemana()?.id)?.entrada ?? null,
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
    // 1. Si ya está usado, no hace nada
    if (plato.usado) return;

    // 2. Creamos la versión actualizada del plato
    const platoActualizado: Plato = { ...plato, usado: true };

    // 3. Actualizamos el arreglo global 'platos'
    this.menuservice.marcarPlatoComoUsado(plato);

    const diaActual = this.diaSemana();
    if (!diaActual) return;

    this.menuservice.menuGrid.update((m) => {
      const existe = m.some((i) => i.dia.id == diaActual.id);

      if (existe) {
        return m.map((e) => {
          if (e.dia.id == diaActual.id) {
            return {
              ...e,
              entrada: plato.categoria == 1 ? plato : e.entrada,
              fondo: plato.categoria == 2 ? plato : e.fondo,
            };
          }
          return e;
        });
      }

      return [
        ...m,
        {
          dia: this.diaSemana()!,
          entrada: plato.categoria == 1 ? plato : undefined,
          fondo: plato.categoria == 2 ? plato : undefined,
        },
      ];
    });

    console.log(this.menuservice.menuGrid());

    // 5. Ocultar buscador y limpiar texto
    this.mostrarBuscador.set(false);
  }

  quitarPlato(idcategoria: number): void {
    const diaActual = this.diaSemana();
    if (!diaActual) return;



    this.menuservice.menuGrid.update((menu) => {
      return menu.map(m => {
        if (m.dia.id == diaActual.id) {
          const idplato= idcategoria==1 ? m.entrada?.id: m.fondo?.id;
          if(idplato){
            this.menuservice.liberarPlato(idplato);
          }

          return {
            dia:m.dia,
            entrada: idcategoria == 1 ? undefined : m.entrada,
            fondo: idcategoria == 2 ? undefined : m.fondo,
          };
        }
        return m;
      });
    });
  }


}
