import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { Plato } from '../interfaces/Plato.interface';
import { DiaMenuGrid, MenuSemanalBD, Semana } from '../interfaces/semana.interface';
import { menuSemanal } from '../interfaces/menuSemanal.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenusService {
  platos = signal<Plato[]>([]);
  semana = signal<Semana[]>([]);
  menuSemanal = signal<menuSemanal[]>([]);
  menuGrid = signal<DiaMenuGrid[]>([]);
  platoEnEdicion = signal<Plato | null>(null);

  private http = inject(HttpClient);

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

  async cargarDatosIniciales() {
    console.log('cargando datos iniciales');
    await this.cargarSemana();

    await this.cargarPlatos();


    this.menuSemanal.set([
      { dia_id: 1, categoria_id: 1, plato_id: 1 },
      /* { dia_id: 1, categoria_id: 2, plato_id: 3 },
       { dia_id: 2, categoria_id: 2, plato_id: 2 },
       { dia_id: 2, categoria_id: 1, plato_id: 6 },*/
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

  async cargarSemana(): Promise<void> {
    try {
      const datos = await firstValueFrom(
        this.http.get<Semana[]>(`${environment.MenuApiUrl}/DiaSemana`)
      );
      this.semana.set(datos);
    } catch (error) {
      console.error('Error al cargar la semana', error);
    }
  };

  async cargarPlatos(): Promise<void> {
    try {
      const datos = await firstValueFrom(
        this.http.get<any[]>(`${environment.MenuApiUrl}/Platos`)
      );
      const platosMapeados: Plato[] = datos.map(item => ({
        id: item.id,
        nombre: item.nombre,
        usado: item.usado,
        categoria: item.idCategoria // Renombramos aquí
      }));

      this.platos.set(platosMapeados);
    } catch (error) {
      console.error('Error al cargar los platos', error);
    }
  };

  guardarMenusemanal() {

    //console.log(this.menuGrid());
    const resultado = this.menuGrid().flatMap(({ dia, entrada, fondo }) => [
      ...(entrada ? [{ dia_id: dia.id, categoria_id: 1, plato_id: entrada.id }] : []),
      ...(fondo ? [{ dia_id: dia.id, categoria_id: 2, plato_id: fondo.id }] : []),
    ]);

    this.menuSemanal.set(resultado);

    // console.log(this.menuSemanal());
  };

  guardarPlatoBD(plato: Plato) {
    // Construimos el objeto exacto que espera la API
    const nuevoplato = {
      nombre: plato.nombre,
      idCategoria: plato.categoria, // o plato.idCategoria según tu interfaz
      usado: plato.usado ?? false
    };

    // Enviamos la petición POST y nos suscribimos para que se ejecute
    return this.http.post<Plato>(`${environment.MenuApiUrl}/Platos`, nuevoplato).subscribe({
      next: (platoCreado) => {
        console.log('Plato guardado con éxito:', platoCreado);
        // Aquí puedes actualizar tu lista o Signal de platos si lo necesitas
      },
      error: (err) => {
        console.error('Error al guardar el plato:', err);
      }
    });
  }

}
