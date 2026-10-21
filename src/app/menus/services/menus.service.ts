import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { Plato, PlatoApiDto } from '../interfaces/Plato.interface';
import { DiaMenuGrid, MenuSemanalBD, Semana } from '../interfaces/semana.interface';
import { MenuSemanaApiDto, menuSemanal } from '../interfaces/menuSemanal.interface';
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

  marcarPlatoComoUsado(idplato: number): void {
    //if (platomarcado.usado) return;

    this.platos.update((platos) =>
      platos.map((p) => (p.id == idplato ? { ...p, usado: true } : p)),
    );
  }

  asignarPlatoADia(plato: Plato, diaActual: Semana) {

    this.marcarPlatoComoUsado(plato.id);

    this.menuGrid.update((m) => {
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
          dia: diaActual,
          entrada: plato.categoria == 1 ? plato : undefined,
          fondo: plato.categoria == 2 ? plato : undefined,
        },
      ];
    });

  }

  quitarPlatoDelDia(idcategoria: number, idplato: number) {
    this.menuGrid.update((menu) => {
      return menu.map(m => {
        if (m.dia.id == idplato) {
          const idplato = idcategoria == 1 ? m.entrada?.id : m.fondo?.id;
          if (idplato) {
            this.liberarPlato(idplato);
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
    await this.cargarMenuSemanal();
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
        this.http.get<PlatoApiDto[]>(`${environment.MenuApiUrl}/Platos`)
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

  async cargarMenuSemanal(): Promise<void> {
    try {
      const datos = await firstValueFrom(this.http.get<MenuSemanaApiDto[]>(`${environment.MenuApiUrl}/MenuSemana`));

      const menuSemanalMapeados: menuSemanal[] = datos.map(item => ({
        id: item.id,
        dia_id: item.idDia,
        categoria_id: item.idCategoria,
        plato_id: item.idPlato,
        usuario_id:item.idUsuario
      }));

      this.menuSemanal.set(menuSemanalMapeados);
      //marcar los platos como usados
      this.menuSemanal().forEach(menu=>{
        this.marcarPlatoComoUsado(menu.plato_id);
      });

      const menuBD = this.menuSemanal();

      const platosMap = new Map(this.platos().map((p) => [p.id, p]));

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

    } catch (error) {
      console.error('Error al cargar el MenuSemanal', error);
      throw error;
    }
  }

  async guardarMenusemanal(): Promise<void> {
    const resultado = this.menuGrid().flatMap(({ dia, entrada, fondo }) => [
      ...(entrada ? [{ dia_id: dia.id, categoria_id: 1, plato_id: entrada.id, usuario_id: 1 }] : []),
      ...(fondo ? [{ dia_id: dia.id, categoria_id: 2, plato_id: fondo.id, usuario_id: 1 }] : []),
    ]);

    this.menuSemanal.set(resultado);

    const menuBD: MenuSemanaApiDto[] = this.menuSemanal().map(item => ({
      id: 0,
      idDia: item.dia_id,
      idCategoria: item.categoria_id,
      idPlato: item.plato_id,
      idUsuario: item.usuario_id
    }))
    console.log(menuBD);
    const datos = await firstValueFrom(this.http.post(`${environment.MenuApiUrl}/MenuSemana/reemplazar`, menuBD));

  };

  async guardarPlatoBD(plato: Plato): Promise<void> {

    // Construimos el objeto exacto que espera la API
    const nuevoplato = {
      nombre: plato.nombre,
      idcategoria: plato.categoria, // o plato.idCategoria según tu interfaz
      usado: plato.usado ?? false
    };

    try {

      const datos = await firstValueFrom(this.http.post<Plato>(`${environment.MenuApiUrl}/Platos`, nuevoplato));

      this.platos.update((platos) => {
        // Generar un ID seguro basado en el valor máximo actual
        const maxId = platos.reduce((max, p) => (p.id > max ? p.id : max), 0);

        return [
          ...platos,
          {
            id: maxId + 1,
            nombre: plato.nombre,
            categoria: plato.categoria,
            usado: false,
          },
        ];

      });
    } catch (err) {
      console.error('Error al guardar el plato:', err);
      throw err;
    }

  }


  async editarPlatoBD(platoEdit: Plato): Promise<void> {

    //console.log(platoEdit);
    const nuevoplato = {
      nombre: platoEdit.nombre,
      idcategoria: platoEdit.categoria,
      usado: platoEdit.usado ?? false
    };

    try {
      const datos = await firstValueFrom(this.http.put<Plato>(`${environment.MenuApiUrl}/Platos/${platoEdit.id}`, nuevoplato));
      this.platos.update((platos) => {
        return platos.map(p => p.id == platoEdit.id ? { ...p, nombre: nuevoplato.nombre, categoria: nuevoplato.idcategoria } : p)
      });

    } catch (error) {
      console.error('Error al guardar el plato:', error);
      throw error;
    }

  }

  async eliminarPlatoBD(idplato: number): Promise<void> {
    try {
      const datos = await firstValueFrom(this.http.delete(`${environment.MenuApiUrl}/Platos/${idplato}`));
      this.platos.update(plato =>
        plato.filter(p => p.id != idplato)
      );

    } catch (error) {
      console.log('Error al eliminar el plato', error);
    }
  }

}
