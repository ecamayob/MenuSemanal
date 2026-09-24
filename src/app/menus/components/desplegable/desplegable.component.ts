import { Component, computed, inject, input, linkedSignal, model, output, signal } from '@angular/core';
import { Plato } from '../../interfaces/Plato.interface';
import { MenusService } from '../../services/menus.service';

@Component({
  selector: 'desplegable',
  imports: [],
  templateUrl: './desplegable.component.html',
})
export  class DesplegableComponent {
  public menuservice= inject(MenusService);

  categoriaSeleccionada = input<number | null>();
  oPlatoSelect=output<Plato>();

  busqueda = linkedSignal<number | null | undefined, string>({
    source: () => this.categoriaSeleccionada(),
    computation: () => ''
  });


  platosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const cat = this.categoriaSeleccionada();

    return this.menuservice.platos().filter(plato => {
      // Coincidencia por texto
      const coincideTexto = !texto || plato.nombre.toLowerCase().includes(texto);
      // Coincidencia por categoría
      const coincideCategoria = cat === null || plato.categoria === cat;

      return coincideTexto && coincideCategoria;
    });
  });

  actualizarBusqueda(valor: string): void {
      this.busqueda.set(valor);
    }


  elegirPlato(platoElegido: Plato){
    this.oPlatoSelect.emit(platoElegido);
    this.busqueda.set('');
  }







}


