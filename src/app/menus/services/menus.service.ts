import { Injectable, Service, signal } from '@angular/core';
import { Plato } from '../interfaces/Plato.interface';

@Injectable({providedIn:'root'})
export class MenusService {

platos = signal<Plato[]>([
    { id: 1, nombre: 'Ceviche', usado: false , categoria:2},
    { id: 2, nombre: 'Ceviche mixto', usado: false , categoria:2 },
    { id: 3, nombre: 'Tiradito de pescado', usado: false , categoria:2 },
    { id: 4, nombre: 'Causa', usado: false , categoria:1},
    { id: 5, nombre:'Papa a la huancaina', usado:false, categoria:1},
    { id: 6, nombre: 'Ensalada', usado: false , categoria:1},
    { id: 7, nombre: 'Lomo Saltado', usado: false , categoria:2 },
    { id: 8, nombre: 'Arroz con Pollo', usado: false , categoria:2 }
  ]);


marcarPlatoComoUsado (platomarcado : Plato): void{
      this.platos.update( platos =>
          platos.map(p=>p.id==platomarcado.id ? {...p, usado:true} : p)
      );
};

liberarPlato (idplato : number):void{
    this.platos.update(platos=>
      platos.map(p=>p.id==idplato ? {...p,usado:false}: p)
    );
};


}
