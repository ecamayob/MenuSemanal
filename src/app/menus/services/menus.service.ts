import { Injectable, Service, signal } from '@angular/core';
import { Plato } from '../interfaces/Plato.interface';
import { DiaMenuGrid, MenuSemanalBD, Semana } from '../interfaces/semana.interface';

@Injectable({ providedIn: 'root' })
export class MenusService {

  platos = signal<Plato[]>([]);
  semana = signal<Semana[]>([]);
  menuGrid = signal<DiaMenuGrid[]>([]);

  marcarPlatoComoUsado(platomarcado: Plato): void {
    this.platos.update(platos =>
      platos.map(p => p.id == platomarcado.id ? { ...p, usado: true } : p)
    );
  };

  liberarPlato(idplato: number): void {
    this.platos.update(platos =>
      platos.map(p => p.id == idplato ? { ...p, usado: false } : p)
    );
  };

  /***********************************/

  cargarDatosIniciales() {

    this.semana.set([
      { id: 1, nombre: "Lunes" },
      { id: 2, nombre: "Martes" },
      { id: 3, nombre: "Miercoles" },
      { id: 4, nombre: "Jueves" },
      { id: 5, nombre: "Viernes" },
      { id: 6, nombre: "Sabado" },
      { id: 7, nombre: "Domingo" },
    ]);

    this.platos.set([
      { id: 1, nombre: 'Ceviche', usado: false, categoria: 2 },
      { id: 2, nombre: 'Ceviche mixto', usado: false, categoria: 2 },
      { id: 3, nombre: 'Tiradito de pescado', usado: false, categoria: 2 },
      { id: 4, nombre: 'Causa', usado: false, categoria: 1 },
      { id: 5, nombre: 'Papa a la huancaina', usado: false, categoria: 1 },
      { id: 6, nombre: 'Ensalada', usado: false, categoria: 1 },
      { id: 7, nombre: 'Lomo Saltado', usado: false, categoria: 2 },
      { id: 8, nombre: 'Arroz con Pollo', usado: false, categoria: 2 }
    ]);

    const menusemanal: MenuSemanalBD[] = ([
      { dia_id: 1, categoria_id: 1, plato_id: 5 },
      { dia_id: 1, categoria_id: 2, plato_id: 3 },
      { dia_id: 2, categoria_id: 2, plato_id: 2 },
      { dia_id: 2, categoria_id: 1, plato_id: 6 }
    ]);

 const menudia = this.semana().map(s => {
    const regEntrada=  menusemanal.find(p => p.categoria_id == 1 && p.dia_id == s.id);
    const regFondo=  menusemanal.find(p => p.categoria_id == 2 && p.dia_id == s.id);

      return {
        dia:s,
        // Buscamos el plato completo en el catálogo mediante su plato_id
        entrada: regEntrada ? this.platos().find(p => p.id === regEntrada.plato_id) : undefined,
        fondo: regFondo ? this.platos().find(p => p.id === regFondo.plato_id) : undefined
      };
    })

    console.log(menudia);

    this.menuGrid.set(menudia);



  }



}
