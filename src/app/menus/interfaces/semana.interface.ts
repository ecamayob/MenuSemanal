import { Plato } from "./Plato.interface";

export interface Semana {
id: number;
nombre:string;


}

export interface DiaMenuGrid {
  dia: Semana;
  entrada?: Plato;
  fondo?: Plato;
}


export interface MenuSemanalBD {
  dia_id: number;
  categoria_id: number;
  plato_id: number;
}


