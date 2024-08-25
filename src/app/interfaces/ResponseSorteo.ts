export interface ResponseSorteo{
  SorteoId?: number,
  FechaSorteo?: string,
  Descripcion?:string,
  status?:string,
  Boletos?: any[],
  NumerosSorteos?: any[]
}
