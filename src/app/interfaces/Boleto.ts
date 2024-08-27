import { Usuario } from './Usuario';
import { NumerosBoletos } from "./NumerosBoletos";
import { Sorteo } from "./Sorteo";

export interface Boleto {
  BoletoID?:number,
  UsuarioID?:number,
  SorteoID:number,
  FechaCompra:string,
  NumerosBoletos?:NumerosBoletos[],
  Sorteo?:Sorteo,
  Usuario?:Usuario,
}
