import { Component, computed, inject, input, signal } from '@angular/core';
import { Plato } from '../../interfaces/Plato.interface';
import { MenusService } from '../../services/menus.service';
import { DesplegableComponent } from '../../components/desplegable/desplegable.component';




@Component({
  selector: 'menu-page',
  imports: [DesplegableComponent],
  templateUrl: './menu-page.html',
})
export default class MenuPage {
  public menuservice = inject(MenusService);

  dia = input.required();
  mostrarBuscador = signal<boolean>(false);
  categoriaSeleccionada = signal<number | null>(null);
  platoSeleccionado = signal<Map<number, Plato>>(new Map());


  entradaSeleccionada = computed(() =>
    this.platoSeleccionado()?.get(1) ?? null
  );

  fondoSeleccionado = computed(() =>
    this.platoSeleccionado()?.get(2) ?? null
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

    // 4. Guardamos la versión actualizada en el Map de seleccionados
    this.platoSeleccionado.update(mapa => {
      const nuevoMapa = new Map<number, Plato>(mapa);
      nuevoMapa.set(platoActualizado.categoria, platoActualizado);
      return nuevoMapa;
    });

    console.log(this.platoSeleccionado());
    //this.oPlatoSelect.emit(this.platoSeleccionado());

    // 5. Ocultar buscador y limpiar texto
    this.mostrarBuscador.set(false);
  }


  quitarPlato(idcategoria: number): void {

    const platoquitar = this.platoSeleccionado().get(idcategoria);
    if (platoquitar) {
      this.menuservice.liberarPlato(platoquitar.id)

      this.platoSeleccionado.update(plato => {
        const nuevomapa = new Map<number, Plato>(plato);
        nuevomapa.delete(idcategoria);
        return nuevomapa;
      });
    }
  }




}
