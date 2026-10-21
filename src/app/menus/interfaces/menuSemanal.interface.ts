import { Plato } from "./Plato.interface";

export interface menuSemanal {
  dia_id: number;
  categoria_id: number;
  plato_id: number;
  usuario_id:number;
}


export interface MenuSemanaApiDto {
  id: number,
  idDia: number,
  idCategoria: number,
  idPlato: number,
  idUsuario:number
}
