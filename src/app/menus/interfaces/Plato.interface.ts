export interface Plato {
  id: number;
  nombre: string;
  usado: boolean;
  categoria: number; // entrada:1 fondo:2
}


export interface PlatoApiDto {
  id: number;
  nombre: string;
  usado: boolean;
  idCategoria: number;
}
