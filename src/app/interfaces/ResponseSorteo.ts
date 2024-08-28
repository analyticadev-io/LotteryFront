import { Boleto } from "./Boleto";
import { NumerosSorteos } from "./NumerosSorteos";

export interface ResponseSorteo{
  SorteoId?: number,
  FechaSorteo?: string,
  Title?:string,
  Descripcion?:string,
  Status?:string,
  Boletos?: Boleto[],
  NumerosSorteos?: NumerosSorteos[]
}
