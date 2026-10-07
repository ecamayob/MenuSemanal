import { computed, Injectable, Service, signal } from '@angular/core';
import { Plato } from '../interfaces/Plato.interface';
import { DiaMenuGrid, MenuSemanalBD, Semana } from '../interfaces/semana.interface';
import { menuSemanal } from '../interfaces/menuSemanal.interface';

@Injectable({ providedIn: 'root' })
export class MenusService {
  platos = signal<Plato[]>([]);
  semana = signal<Semana[]>([]);
  menuSemanal = signal<menuSemanal[]>([]);
  menuGrid = signal<DiaMenuGrid[]>([]);

   platoEnEdicion = signal<Plato | null>(null);

  constructor() {
    this.cargarDatosIniciales();
  }

  marcarPlatoComoUsado(platomarcado: Plato): void {
    this.platos.update((platos) =>
      platos.map((p) => (p.id == platomarcado.id ? { ...p, usado: true } : p)),
    );
  }

  liberarPlato(idplato: number): void {
    this.platos.update((platos) =>
      platos.map((p) => (p.id == idplato ? { ...p, usado: false } : p)),
    );
  }

  /***********************************/

  cargarDatosIniciales() {
    console.log('cargando datos iniciales');
    this.semana.set([
      { id: 1, nombre: 'Lunes' },
      { id: 2, nombre: 'Martes' },
      { id: 3, nombre: 'Miercoles' },
      { id: 4, nombre: 'Jueves' },
      { id: 5, nombre: 'Viernes' },
      { id: 6, nombre: 'Sabado' },
      { id: 7, nombre: 'Domingo' },
    ]);

    this.platos.set([
      { id: 1, nombre: 'Ceviche', usado: false, categoria: 2 },
      { id: 2, nombre: 'Ceviche mixto', usado: true, categoria: 2 },
      { id: 3, nombre: 'Tiradito de pescado', usado: true, categoria: 2 },
      { id: 4, nombre: 'Causa', usado: false, categoria: 1 },
      { id: 5, nombre: 'Papa a la huancaina', usado: true, categoria: 1 },
      { id: 6, nombre: 'Ensalada', usado: true, categoria: 1 },
      { id: 7, nombre: 'Lomo Saltado', usado: false, categoria: 2 },
      { id: 8, nombre: 'Arroz con Pollo', usado: false, categoria: 2 },
    ]);

    this.menuSemanal.set([
      { dia_id: 1, categoria_id: 1, plato_id: 5 },
      { dia_id: 1, categoria_id: 2, plato_id: 3 },
      { dia_id: 2, categoria_id: 2, plato_id: 2 },
      { dia_id: 2, categoria_id: 1, plato_id: 6 },
    ]);

    const platosMap = new Map(this.platos().map((p) => [p.id, p]));
    const menuBD = this.menuSemanal();

    const itemMenu = this.semana().map((dia) => {
      const regEntrada = menuBD.find((p) => p.dia_id === dia.id && p.categoria_id === 1);
      const regFondo = menuBD.find((p) => p.dia_id === dia.id && p.categoria_id === 2);

      return {
        dia,
        entrada: regEntrada ? platosMap.get(regEntrada.plato_id) : undefined,
        fondo: regFondo ? platosMap.get(regFondo.plato_id) : undefined,
      };
    });

    this.menuGrid.set(itemMenu);
  }

  guardarMenusemanal() {

     console.log(this.menuGrid());
    const resultado = this.menuGrid().flatMap(({ dia, entrada, fondo }) => [
      ...(entrada ? [{ dia_id: dia.id, categoria_id: 1, plato_id: entrada.id }] : []),
      ...(fondo ? [{ dia_id: dia.id, categoria_id: 2, plato_id: fondo.id }] : []),
    ]);

    this.menuSemanal.set(resultado);

    console.log(this.menuSemanal());
  }
}
