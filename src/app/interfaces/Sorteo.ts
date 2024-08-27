import { Boleto } from "./Boleto";
import { NumerosSorteos } from "./NumerosSorteos";

export interface Sorteo{
  SorteoId?: number,
  FechaSorteo: string,
  Title:string,
  Descripcion:string,
  NumerosSorteos?:NumerosSorteos,
  Boletos?:Boleto
}
